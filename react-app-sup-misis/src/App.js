
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsTextBoxVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="upload-container">
      <label htmlFor="file-input" className="upload-button">
        Загрузить фото
      </label>
      <div className="img-text-box">
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
        {imageSrc && (
          <img
            className="uploaded-image"
            id="uploaded-image"
            src={imageSrc}
            alt="Загруженное изображение"
          />
        )}
        {isTextBoxVisible && (
          <div id="text-box" className="text-box">
            Это текстовый блок, отображающийся после загрузки изображения.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
