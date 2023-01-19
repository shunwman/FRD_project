import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './components/Login';
import Register from './pages/Register';
import AddRecipePage from './pages/AddRecipePage';
import AddRecipeFormPage from './pages/AddRecipeFormPage'
import Home from './pages/Home';
import { BrowserRouter, Link, Routes } from 'react-router-dom';
import { Route } from 'react-router'
import NoMatch from './components/NoMatch';
import Profile from './pages/Profile';
import SearchPage from './pages/SearchPage';
import ProfileEditPage from './pages/ProfileEditPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHouse, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChakraProvider } from '@chakra-ui/react'
import RequireAuth from "./components/RequireAuth";
import RecipePage from './pages/RecipePage';
import Test from './pages/Test';
import Result from './pages/Result';
import TestFileUpload from './pages/TestFileUpload';
import { useLocation } from 'react-router-dom';

function App() {


  // global variable to show the login status
  let loggedIn = true

  // show if it is logged in
  const loginFunc = () => {
    if (!loggedIn) {
      return <div className='ask-for-login'> :P Please login</div>
    }

  }
  const usePathname = () => {
    const location = useLocation();
    console.log(location)
    return location
    // return location.pathname;
  }

  // const [showFooter , setShowFooter] 

  // usePathname()
  // const pathname = window.location.pathname
  // console.log(pathname)
  return (
    <ChakraProvider>

      <div className="App">

        <BrowserRouter>

          {/* {usePathname} */}


          <div className='footer'>
            <Link to="/" className="link"><FontAwesomeIcon icon={faHouse} size="2x" /></Link>
            <br />
            <Link to="/search-page" className="link"><FontAwesomeIcon icon={faSearch} size="2x" /></Link>
            <br />
            <Link to="/add-recipe-page" className="link"><FontAwesomeIcon icon={faSquarePlus} size="2x" /></Link>
            {/* <Link to="/add-recipe-form-page" className="link"><FontAwesomeIcon icon={faSquarePlus} size="2x" /></Link> */}
            <br />
            <Link to="/login" className="link"><FontAwesomeIcon icon={faUser} size="2x" /></Link>

          </div>
          {/* use boolean to trigger the fotter ^ */}

          {/* {usePathname()} */}

          {loginFunc()}


          <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/test2' element={<TestFileUpload />} />
            <Route path='/search-page' element={<SearchPage />} />
            <Route path='/recipe-page/*' element={<RecipePage />} />
            <Route path='/result-page' element={<Result />} />
            <Route path='/add-recipe-page' element={<AddRecipePage />} />
            <Route path='/add-recipe-form-page' element={<AddRecipeFormPage />} />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/user" element={<RequireAuth />}>
              <Route path="profile" element={<Profile />}></Route>
            </Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="*" element={<Login />}></Route>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile-edit-page' element={<ProfileEditPage />} />
            <Route path='/profile-edit-page' element={<ProfileEditPage />} />

          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
