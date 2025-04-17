import { useState, useEffect } from "react";
import "./App.css";
import db from "./firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(fetchedProducts, "fetchedProducts"); // Перевірка даних
      setProducts(fetchedProducts);
    });

    return () => unsub();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("Додай назву продукту");
      return;
    }

    const newProduct = {
      name,
      description,
    };

    try {
      await addDoc(collection(db, "products"), newProduct);
      console.log("Продукт додано!");
    } catch (error) {
      console.error("Помилка при додаванні продукту:", error);
    }

    // Очистити форму
    setName("");
    setDescription("");
    e.target.reset();
  };

  return (
    <div className="App">
      <h2>Додати продукт</h2>
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
        <button type="submit">Додати</button>
      </form>

      <h2>Продукти</h2>
      {products.map((product) => (
        <div key={product.id} className="product">
          <h3>{product.name}</h3>
          {product.description && <p>{product.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default App;
