import Header from './Header';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import {useState, useEffect} from 'react'
import SearchItem from './SearchItem';


function App() {
  const API_URL = "http://localhost:3500/items"
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState('')
  const [newItem, setNewItem] = useState('')
  const [fetchError, setfetchError] = useState(null)
  const [isLoading, setisLoading] = useState(true)


  useEffect(()=>{
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw Error("did not received the data ")
        const listItems = await response.json()
        setItems(listItems)
        setfetchError(null);
      } catch (error) {
        setfetchError(error.message);

      } finally {
        setisLoading(false)
      }
    }
    setTimeout(() => {
        (async () => await fetchItems())();
      
    }, 2000);
  }, [])


  // const setAndSaveItems = (newItems) => {
  //   setItems(newItems);
  // }

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = {id, checked:false, item}
    const listItems = [...items, myNewItem];
    setItems(listItems);
  }


  const handleCheck = (id) => {
    const listItems = items.map((item) => item.id ===id ? {...item, checked: !item.checked}: item)
    setItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('')
  }


  return (
    <div className="App">
      <Header title="Grocery List"/>
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading items.... </p>}
        {fetchError && <p style={{
          color:"red"
        }}> {`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content 
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      
      <Footer length={items.length} />
    </div>
  );
}

export default App;
