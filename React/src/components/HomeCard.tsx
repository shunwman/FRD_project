import { useEffect, useState } from "react"
import icon from "../assets/user.jpg"
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image } from '@chakra-ui/react'
import { ArrowForwardIcon, DownloadIcon, StarIcon } from "@chakra-ui/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router"
//redux 

import { useDispatch, useSelector } from "react-redux"
import store, { IRootState } from "../redux/store"
//redux for user 
import { fetchGetMe } from "../redux/user/thunk"
import { fetchSaveRecipe, fetchUnsaveRecipe, fetchSaveCheck } from "../redux/recipe/thunk"
import { fetchLikeRecipe, fetchUnLikeRecipe, fetchLikeCheck } from "../redux/recipe/thunk"
interface Item {
  id: number
  username: string
  user_icon: string
  cover_image: string
  name: string
  count: string
  user_id: number
}
interface CardItem {
  item: Item
}

const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export default function HomeCard(props: CardItem) {
  const dispatch = useAppDispatch()
  const displayId: number = useSelector((state: IRootState) => state.user.displayId)
  const item = props.item

  const navigate = useNavigate()
  const token = localStorage.getItem("token")



  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const fetchUser = async () => {
        await dispatch(fetchGetMe({ token: token }))
      }
      fetchUser();
    }

  }, [])

  useEffect(() => {
    if (displayId > 0) {
      const fetchCheck = async () => {
        const resultSave = await dispatch(fetchSaveCheck({ userId: displayId, recipeId: item.id }))
        changeSave(resultSave.payload.message)
        const resultLike = await dispatch(fetchLikeCheck({ userId: displayId, recipeId: item.id }))
        changeLike(resultLike.payload.message)
      }
      fetchCheck()
    }
    changeNumlike(parseInt(item.count ? item.count : "0"))

  }, [displayId])
  const [save, changeSave] = useState("save")
  //like btn 
  const [like, changeLike] = useState("like")
  const [numlike, changeNumlike] = useState(0)

  function saveBtn() {
    if (token) {
      if (save === "save") {

        changeSave("unsave")
        const res = dispatch(fetchSaveRecipe({ userId: displayId, recipeId: item.id }))
        console.log("save: ", res);
      } else {
        console.log("unsave the items.");
        changeSave("save")
        const res = dispatch(fetchUnsaveRecipe({ userId: displayId, recipeId: item.id }))
        console.log("unsave: ", res);
      }
    }

  }

  function likeBtn() {
    if (token) {
      if (like === "like") {
        changeNumlike(numlike + 1)
        changeLike("unlike")
        const res = dispatch(fetchLikeRecipe({ userId: displayId, recipeId: item.id }))

        console.log("like: ", res);
      } else {
        console.log("unlike the items.");
        changeNumlike(numlike - 1);
        changeLike("like")

        const res = dispatch(fetchUnLikeRecipe({ userId: displayId, recipeId: item.id }))
        console.log("unlike: ", res);
      }
    }
  }
  return <div key={item.id}>
    <Card className="home-recipes-card" maxW='md' boxShadow="xl">
      <CardHeader>
        <Flex >
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar name={item.username} src={item.user_icon} />

            <Box>
              <Heading size='sm'>{item.username}</Heading>
            </Box>
          </Flex>
          <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label='See menu'
            icon={<StarIcon style={{ color: save === "unsave" ? "orange" : "black" }} onClick={() => saveBtn()} />}
          />
        </Flex>
      </CardHeader>

      <Image
        onClick={() => navigate("/recipe-page/?id=" + item.id + "&from=home")}
        src={item.cover_image}
        alt='Chakra UI'
      />
      <CardBody>
        <Heading>{item.name}</Heading>
      </CardBody>
      <CardFooter
        justify='space-between'
        flexWrap='wrap'
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Button flex='1' variant='ghost' leftIcon={< FontAwesomeIcon style={{ color: like === "unlike" ? "orange" : "black" }} icon={faHeart} size="2x" onClick={() => likeBtn()} />}>
          {numlike}
        </Button>
        <Button flex='1' variant='ghost' rightIcon={<ArrowForwardIcon />} onClick={() => navigate("/recipe-page/?id=" + item.id + "&from=home")}>

          觀看

        </Button>

      </CardFooter>
    </Card>
    <div className="blank-block"></div>
  </div>;
}