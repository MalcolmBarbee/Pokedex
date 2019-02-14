import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Load from './components/homeComponents/load';
import List from './containers/pokemonList';
import Profile from './containers/pokemonProfile';
import Header from './components/homeComponents/header';
import Axios from 'axios';
import SearchList from './components/homeComponents/searchList';


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      list: [],
    offset: 0,
    clickedPokemon: false,
    pokemonClicked : null,
    pokemonClickedUrl: null,
    dropdownList: [],
    }
  }
  
  filterDropdown = (e) => {
    const searchStr = e.target.value.trim().toLowerCase();
    const newList = SearchList.filter(n => n.toLowerCase().includes(searchStr));
    this.setState({dropdownList: newList});
  }
  removeDropdown = (e) =>{
    this.setState({dropdownList: []});
  }
  clickPkmn = (e) =>{
    this.setState({pokemonClicked: e.target.innerText}, ()=>{
      console.log(this.state.pokemonClicked, 'was clicked!');
    });
  }


  loadMore = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${this.state.offset}&limit=20`)
    .then((data) => {
      let arr = []
      for (let i = 0; i < data.data.results.length; i++) {
        arr.push(data.data.results[i]);
      }
      return arr;
    })
    .then((arr) => { 
      localStorage.setItem('list', JSON.stringify(this.state.list.concat(arr)));
      localStorage.setItem('offset', this.state.offset + 20);
      this.setState({offset: this.state.offset + 20, list: this.state.list.concat(arr)}, () => {
        console.log(this.state);
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  checkPokemon = (e) => {
    this.setState({clickedPokemon: true, pokemonClicked: e.target.getAttribute('value'), pokemonClickedUrl: e.target.getAttribute('url')}, ()=> {
      // console.log(this.state)
    })
  }

  backHome = () => {
    this.setState({clickedPokemon: false});
  }

  componentDidMount() {
    if (!localStorage.getItem('list')) this.loadMore();
    else this.setState({offset: parseInt(localStorage.getItem('offset')), list: JSON.parse(localStorage.getItem('list'))})
  }
 
  render() {
    const {dropdownList} = this.state;
    return (
      <>
      <Header filterDropdown={this.filterDropdown} dropdownList={dropdownList} clickHeader={this.removeDropdown} clickPkmn={this.clickPkmn} />
        {
          this.state.clickedPokemon ?
            <Profile name={this.state.pokemonClicked} url={this.state.pokemonClickedUrl} home={this.backHome}/>
            :
            <div className="container pokedex">
              <List list={this.state.list} click={this.checkPokemon} />
              <Load load={this.loadMore} />
            </div>
       }
      </>
    );
  }
}

export default App;
