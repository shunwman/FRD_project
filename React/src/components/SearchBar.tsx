import styles from "../css/Search.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faHouse, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

// export const Search = ({
//     onChange,
//   }: {
//     onChange: React.ChangeEventHandler;
//   }) => {
//     return (
//       <input
//         className={ styles.search }
//         type="text"
//         onChange={onChange}
//         placeholder="Search by the title ..."
//       />
//     );
//   };


export default function search(){
  return  <div className= { styles.searchBarContainer }>
   <div className= { styles.search }>
    <FontAwesomeIcon icon={faSearch} />
  <input
          className={ styles.search }
          type="text"
          // onChange={onChange}
          placeholder="Search by the title ..."
        />
  </div>
</div>

}