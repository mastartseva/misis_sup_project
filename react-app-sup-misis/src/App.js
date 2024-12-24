import './App.css';
import axios from 'axios';

function App() {
    const handleFileChange = async (event) => {
      const file = event.target.files[0]; // Получаем выбранный файл
      const uploadedImage = document.getElementById('uploaded-image');
  
      if (file) {
        // Показываем изображение в интерфейсе
        const reader = new FileReader();
        reader.onload = function (e) {
          uploadedImage.src = e.target.result;
          uploadedImage.style.display = 'block';
          document.getElementById('text-box').style.display = 'flex';
        };
        reader.readAsDataURL(file);
  
        // Создаем объект FormData для отправки файла на сервер
        const formData = new FormData();
        formData.append('file', file); // Ключ 'file' должен совпадать с именем поля на сервере
  
        try {
          // Отправляем файл на бэкенд через axios
          const response = await axios.post('http://localhost:3000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Ответ от сервера:', response.data);
        } catch (error) {
          console.error('Ошибка при отправке файла:', error);
        }
      }
    };
  
    return (
      <div className="App">
        <input type="file" id="file-input" onChange={handleFileChange} />
        <img id="uploaded-image" alt="Uploaded preview" style={{ display: 'none', width: '200px', marginTop: '10px' }} />
        <div id="text-box" style={{ display: 'none', marginTop: '10px' }}>Загруженное изображение</div>
      </div>
    );
  }
  
  export default App;
