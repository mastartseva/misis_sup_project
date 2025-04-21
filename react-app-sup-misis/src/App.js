import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allRecipes, setAllRecipes] = useState([]);

  // Загрузка всех рецептов при монтировании компонента
  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/words');
        setAllRecipes(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке рецептов:', error);
      }
    };
    
    fetchAllRecipes();
  }, []);

  // Поиск рецептов при изменении searchTerm
  useEffect(() => {
    const searchRecipes = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`http://localhost:3000/words?prefix=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Ошибка при поиске рецептов:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Добавляем задержку, чтобы избежать слишком частых запросов
    const delayDebounceFn = setTimeout(() => {
      searchRecipes();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const uploadedImage = document.getElementById('uploaded-image');

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block';
        document.getElementById('text-box').style.display = 'flex';
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
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
      {/* Добавляем поисковую строку */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск рецептов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {isSearching && <div className="search-loading">Поиск...</div>}
        
        {/* Отображаем результаты поиска */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Результаты поиска:</h3>
            <ul>
              {searchResults.map((recipe, index) => (
                <li key={index}>{recipe.word} (вес: {recipe.weight})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Остальной ваш код */}
      <input type="file" id="file-input" onChange={handleFileChange} />
      <img id="uploaded-image" alt="Uploaded preview" style={{ display: 'none', width: '200px', marginTop: '10px' }} />
      <div id="text-box" style={{ display: 'none', marginTop: '10px' }}>Загруженное изображение</div>
    </div>
  );
}

export default App;