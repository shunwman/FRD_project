import { Link } from "react-router-dom";
import "../css/searchpage.css"
import { Spinner } from '@chakra-ui/react'
import testImage from "../assets/sample.jpg"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { SimpleGrid, Box, Wrap, WrapItem } from '@chakra-ui/react'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { Controller, set, useForm } from "react-hook-form"
import Select from "react-select";
import { useEffect, useState } from "react";
import styles from "../css/Search.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
//redux for recipe
import { useDispatch, } from "react-redux"
import { fetchGetSearchItem } from "../redux/recipe/thunk"
import store from "../redux/store"
import { useNavigate } from 'react-router-dom';


interface SearchingFormType {
  methods: string[]
  category: string
  style: string
  time: string
  isVegan: string
  ingredients: string
  recipeKeyword: string

}
const useAppDispatch = () => useDispatch<typeof store.dispatch>()
const delay = 0.5;

export interface Props {
  value: string;
}

const option: any = [
  {
    style: "加拿大"
  },
  {
    style: "澳門"
  },
  {
    style: "日本"
  },
  {
    style: "中國"
  },
  {
    style: "馬來西亞"
  },
  {
    style: "意大利"
  },
  {
    style: "法國"
  },
  {
    style: "印度"
  },
  {
    style: "台灣"
  },
  {
    style: "韓國"
  }
];

export default function SearchPage() {




  const { register, handleSubmit, reset } = useForm<SearchingFormType>({
    defaultValues: {
      ingredients: "",
      isVegan: "",
      methods: [],
      recipeKeyword: "",
      time: ""
    }
  });
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [style, setStyle] = useState('')
  const [value, setValue] = useState("");
  const onSubmit = async (data: SearchingFormType) => {
    const defaultValue = {
      ingredients: "",
      isVegan: "",
      methods: [],
      recipeKeyword: "",
      time: "",
      style: ""
    }
    data.style = style
    console.log(data)
    const callApi = new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await dispatch(fetchGetSearchItem({
            recipeKeyword: data.recipeKeyword,
            ingredients: data.ingredients,
            methods: data.methods,
            category: data.category,
            style: data.style,
            time: data.time,
            isVegan: data.isVegan
          })).unwrap()
          resolve(result)

        } catch (e) {
          reject(e)
        }
      }, 1000)
    })
    try {

      if (data.recipeKeyword === "") {
        if (data.isVegan === "") {
          if (data.ingredients === "") {
            if (data.time === "") {
              if (data.methods[0] === undefined) {
                if (data.style === "") {
                  console.log("no input")
                  return
                }
              }
            }
          }
        }
      }
      await callApi
      navigate("/result-page")

    } catch (err) {
      console.log(err)

    }

  }
  const handleChange = (selected: any) => {
    if (selected) {
      setValue(selected);
      setStyle(selected.value)
    }
  }
  const resetAllForm = (selected: any) => {
    selected = null
    reset();
    setValue(selected);
    setStyle("");
  }
  return <div className="container">

    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.searchBarContainer}>
        <div className={styles.search}>

          <input
            className={styles.search}
            type="text"
            // onChange={onChange}
            {...register("recipeKeyword")}
            placeholder="輸入關鍵字搜尋食譜"
          />
          <button className="search-page-btn"><FontAwesomeIcon icon={faSearch} /></button>
        </div>
      </div>
    </form>


    <div className="recipe-search-section">
      <Tabs onChange={resetAllForm}>
        <TabList>
          <Tab>常用關鍵字</Tab>
          <Tab>進階搜尋</Tab>
        </TabList>

        <TabPanels>
          <TabPanel padding="0">
            <div className="popular-container">
              <PopularContainer />
            </div>
          </TabPanel>
          <TabPanel padding="0">

            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      食材關鍵字
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <input className="ingredient-input" {...register('ingredients')} placeholder="輸入食材搜尋食譜" />
                </AccordionPanel>
              </AccordionItem>



              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      國家風味
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <div>



                  </div>

                  <Select
                    className="drop-down"
                    name="style"
                    options={option?.map((option: any, index: number) => ({
                      value: option.style,
                      label: option.style,
                      id: index
                    }))}
                    value={value}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={document.body}
                    placeholder="Select..."
                    onChange={handleChange}
                    menuShouldScrollIntoView={false}
                  />




                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      用時
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="checkBoxContainer">
                      <div className="checkBoxItem"><input type="radio" id="under30min" {...register("time")} value="under30min" />30分鐘以內</div>
                      <div className="checkBoxItem"><input type="radio" id="30to60min"  {...register("time")} value="30to60min" />30分鐘至60分鐘</div>
                      <div className="checkBoxItem"><input type="radio" id="over60min"  {...register("time")} value="over60min" />60分鐘以上</div>
                    </div>
                  </form>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      是否素食
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="checkBoxContainer">
                      <div className="checkBoxItem"><input type="radio" id="isVegan"   {...register("isVegan", {
                        required: true
                      })} value="isVegan" />是</div>

                      <div className="checkBoxItem"><input type="radio" id="notVegan" {...register("isVegan", {
                        required: false
                      })} value="notVegan" />否</div>
                    </div>
                  </form>

                  {/**<Link to="/recipe-page/?id=1" className="link">Testing_link</Link>
                   <Link to="/test" className="link">Testing_link_setTime</Link> */}

                </AccordionPanel>
              </AccordionItem>


            </Accordion>
            {/**<input className="advanceFormSubmit" type="submit" id="advanceFormSubmit" name="advanceFormSubmit" value="advanceFormSubmit"/>**/}

            <div><button className="reset-search-button" onClick={resetAllForm}>清除篩選器</button></div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>


}

function PopularContainer() {
  let timer1 = setTimeout(() => setShow(true), delay * 1000);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [show, setShow] = useState(false);

  const fastSearch = async (keyword: string) => {
    console.log(keyword)
    const callApi = new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await dispatch(fetchGetSearchItem({
            recipeKeyword: "",
            ingredients: keyword,
            methods: [],
            style: "",
            time: "",
            isVegan: ""
          })).unwrap()
          resolve(result)

        } catch (e) {
          reject(e)
        }
      }, 1000)
    })
    try {
      clearTimeout(timer1);
      await callApi
      navigate("/result-page")
    } catch (err) {
      console.log(err)

    }
  }

  // useEffect(() => {
  //   let timer1 = setTimeout(() => setShow(true), delay * 1000);
  //   return () => {

  //   };
  // }, [])

  return show ? (
    <SimpleGrid columns={2} spacing={5}>
      <Box>
        <button onClick={() => fastSearch("牛")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/beef.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">牛</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("雞")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/chicken.webp" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">雞</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("豬")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/pork.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">豬</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("魚")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/fish.webp" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">魚</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("蝦")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/shrimp.webp" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">蝦</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("蟹")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/crab.webp" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">蟹</p>
          </div>
        </button>
      </Box>


      <Box>
        <button onClick={() => fastSearch("椰菜")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/cabbage.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">椰菜</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("白菜")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/chinesecabbage.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">白菜</p>
          </div>
        </button>
      </Box>

      <Box onClick={() => fastSearch("菇")}>

        <div className="popular-recipe">
          <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/mushrooms.webp" alt="recipe001" className="popular-recipe-img" />
          <p className="popular-recipe-title">菇</p>
        </div>

      </Box>


      <Box>
        <button onClick={() => fastSearch("蘿蔔")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/radish.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">蘿蔔</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("蕃茄")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/tomatoes.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">蕃茄</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("洋蔥")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/onion.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">洋蔥</p>
          </div>
        </button>
      </Box>



      <Box>
        <button onClick={() => fastSearch("芝士")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/cheese.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">芝士</p>
          </div>
        </button>
      </Box>

      <Box>
        <button onClick={() => fastSearch("花生")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/peanuts.webp" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">花生</p>
          </div>
        </button>
      </Box>

      <Box onClick={() => fastSearch("蛋")}>

        <div className="popular-recipe">
          <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/egg.jpg" alt="recipe001" className="popular-recipe-img" />
          <p className="popular-recipe-title">蛋</p>
        </div>

      </Box>

      <Box>
        <button onClick={() => fastSearch("馬鈴薯")}>
          <div className="popular-recipe">
            <img src="https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/potatoes.jpg" alt="recipe001" className="popular-recipe-img" />
            <p className="popular-recipe-title">馬鈴薯</p>
          </div>
        </button>
      </Box>


    </SimpleGrid>
  ) : (
    <div className="loader-non-cover"><Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='red.500'
      size='xl'
    /></div>);

}