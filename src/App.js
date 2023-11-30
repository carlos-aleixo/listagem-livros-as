import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  let [lista, setLista] = useState([]);
  let [Item, setItem] = useState('');
  let [Item2, setItem2] = useState('');
  let [Item3, setItem3] = useState('');
  let [Item4, setItem4] = useState('');

  function listarLivros() {
    axios.get('http://localhost:3030/api/livros')
      .then(response => {
        setLista(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar livros:", error);
      });
  }

  useEffect(listarLivros, []);

  function addItem() {
    axios.post('http://localhost:3030/api/livros', { titulo: Item, autor: Item2, editora: Item3, ano: Item4, concluida: 0 }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log('Novo livro cadastrado:', response.data);
          setLista([...lista, { id: response.data.id, titulo: Item, autor: Item2, editora: Item3, ano: Item4, concluida: 0 }]);
          setItem('');
          setItem2('');
          setItem3('');
          setItem4('');
        } else {
          console.error('Erro ao cadastrar livro:', response.data);
        }
      })
      .catch(error => {
        console.error("Erro ao adicionar livro:", error.response ? error.response.data : error.message);
      });
  }

  function deletarItem(index) {
    const id = lista[index].id;

    axios.delete(`http://localhost:3030/api/livros/${id}`)
      .then(response => {
        let tmpArray = [...lista];
        tmpArray.splice(index, 1);
        setLista(tmpArray);
      })
      .catch(error => {
        console.error("Erro ao deletar tarefa:", error);
      });
  }

  function marcarComoConcluida(index) {
    const id = lista[index].id;
    const isConcluida = lista[index].concluida === 0 ? 1 : 0;

    axios.patch(`http://localhost:3030/api/livros/${id}`, { concluida: isConcluida })
      .then(response => {
        let tmpArray = [...lista];
        tmpArray[index].concluida = isConcluida;
        setLista(tmpArray);
      })
      .catch(error => {
        console.error("Erro ao marcar tarefa como concluída:", error);
      });
  }

  return (
    <>
      <div className='container'>
        <h1>LISTA DE LIVROS</h1>
        <div className='novoItem'>
          <input
            placeholder='Título'
            value={Item}
            onChange={value => setItem(value.target.value)}
            type='text'
          />
        </div>
        <div className='novoItem'>
          <input
            placeholder='Autor'
            value={Item2}
            onChange={value => setItem2(value.target.value)}
            type='text'
          />
        </div>
        <div className='novoItem'>
          <input
            placeholder='Editora'
            value={Item3}
            onChange={value => setItem3(value.target.value)}
            type='text'
          />
        </div>
        <div className='novoItem'>
          <input
            placeholder='Ano'
            value={Item4}
            onChange={value => setItem4(value.target.value)}
            type='text'
          />
        </div>
        <button onClick={addItem}>Adicionar</button>
        <div className='lista'>
          {lista.map((item, index) => (
            <li key={index}>
              <div className='item'>
                <p className='borda'>Lido <input
                  type='checkbox'
                  checked={item.concluida}
                  onChange={() => marcarComoConcluida(index)}
                /></p>
                <p>Título: {item.titulo}</p>
                <p>Autor: {item.autor}</p>
                <p>Editora: {item.editora}</p>
                <p>Ano: {item.ano}</p>
                <div className='espaco'>
                  <button onClick={() => deletarItem(index)}>Deletar</button>
                </div>
              </div>
            </li>
          ))}
        </div>
        <div className='mt-5'>
          <button onClick={listarLivros}>Listar</button>
        </div>
      </div>
    </>
  );
}

export default App;