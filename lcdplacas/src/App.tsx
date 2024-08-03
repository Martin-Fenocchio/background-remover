/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";
import Logo from "src/assets/images/logo.png";
import "src/assets/styles/app.scss";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<any>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (event.target.files ?? [])[0];

    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/upload",
          formData,
          {
            responseType: "blob",
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        const blob = new Blob([response.data], { type: "image/png" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "processed_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLoading(false);

        fileInputRef.current!.value = "";
      } catch (error) {
        setIsLoading(false);
        alert(`Error: ${JSON.stringify(error)}`);
      }
    }
  };

  return (
    <>
      <main>
        <img src={Logo} alt="Logo" className="logo" />

        <h2>Borrador de fondos</h2>

        <p>
          {isLoading
            ? "Eliminando fondo de las fotos..."
            : "Primero, selecciona una o varias fotos:"}
        </p>

        <form>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="upload-button" data-loading={isLoading}>
            <i className="fa-solid fa-image"></i>
            {isLoading ? "Procesando..." : "Subir fotos"}
          </div>
        </form>
      </main>
    </>
  );
}

export default App;
