import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Користувач авторизований:", user);
    } else {
      console.log("Користувач не авторизований");
    }
  });

  return () => unsubscribe();
}, []);
