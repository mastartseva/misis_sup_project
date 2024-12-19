import logo from './logo.svg';
import './App.css';

function App() {
  const fileInput = document.getElementById('file-input');
  const uploadedImage = document.getElementById('uploaded-image');

  fileInput.addEventListener('change', function () {
      const file = fileInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              uploadedImage.src = e.target.result;
              uploadedImage.style.display = 'block';
              document.getElementById('text-box').style.display = 'flex';
          };
          reader.readAsDataURL(file);
      }
})

};


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
// }

export default App;
