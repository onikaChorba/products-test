import { useState, useEffect } from "react";
import db from "./firebase.config";
import {
  collection,
  onSnapshot,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const auth = getAuth();

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // Перевіряє, чи поточний користувач є в списку адмінів
  const checkIfAdmin = async (uid) => {
    try {
      const docRef = doc(db, "roles", "admin");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const adminData = docSnap.data();
        const adminUids = adminData.uids ? Object.values(adminData.uids) : [];
        console.log("Firestore admin UIDs:", adminUids);
        return adminUids.includes(uid); // Перевірка наявності UID у масиві
      } else {
        console.log("Документ 'admin' не знайдено в Firestore");
        return false;
      }
    } catch (error) {
      console.error("Помилка при перевірці адміністратора:", error);
      return false;
    }
  };

  useEffect(() => {
    // 🔐 Увійти автоматично під фіксованим адміністратором
    signInWithEmailAndPassword(auth, "onika.chorba@gmail.com", "test1111")
      .then((userCredential) => {
        console.log("Успішний вхід:", userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Помилка входу:", error);
      });

    // 👤 Відслідковувати зміну автентифікації
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminStatus = await checkIfAdmin(user.uid);
        console.log("Admin Status:", adminStatus); // Логування статусу адміністратора
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    // 📦 Підписка на продукти
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(fetched);
    });

    return () => {
      unsubAuth();
      unsubProducts();
    };
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Додай назву продукту");
      return;
    }

    let imageUrl = "";

    if (image) {
      const storage = getStorage();
      const imageRef = ref(storage, `products/${Date.now()}-${image.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Помилка при завантаженні зображення:", error);
      }
    }

    const newProduct = { name, description, imageUrl };

    try {
      await addDoc(collection(db, "products"), newProduct);
      console.log("Продукт додано!");
    } catch (error) {
      console.error("Помилка при додаванні продукту:", error);
    }

    setName("");
    setDescription("");
    setImage(null);
    e.target.reset();
  };

  return (
    <div className="App">
      <h2>Додати продукт</h2>
      {isAdmin ? (
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Назва"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <button type="submit">Додати</button>
        </form>
      ) : (
        <p>Ви не маєте прав для додавання продуктів</p>
      )}

      <h2>Продукти</h2>
      {products.map((product) => (
        <div key={product.id} className="product">
          <h3>{product.name}</h3>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: 150 }}
            />
          )}
          {product.description && <p>{product.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default App;
