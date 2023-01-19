import "../css/home.css"
import HomeCard from '../components/HomeCard';
import Search from "../components/SearchBar"
import logo from "../assets/cooking.png"
import { faSearch } from '@fortawesome/free-solid-svg-icons'
// import Filter from "../components/Filter"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { render } from "@testing-library/react"
import React, { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Home/Loader";
import EndMsg from "../components/Home/EndMsg";
import { Card, CardHeader, CardBody, CardFooter, Flex, Avatar, Box, Heading, IconButton, Button, Text, Image, Spinner } from '@chakra-ui/react'
import { ArrowForwardIcon, DownloadIcon } from "@chakra-ui/icons"
import styles from "../css/Search.module.css";
//redux for recipe
import { useDispatch, } from "react-redux"
import { fetchGetSearchItem } from "../redux/recipe/thunk"
import store from "../redux/store"
import { useNavigate } from 'react-router-dom';
import { Controller, set, useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import { useControllableProp, useControllableState } from '@chakra-ui/react'
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

export default function Home() {
    const { register, handleSubmit, reset } = useForm<SearchingFormType>({
        defaultValues: {
            ingredients: "",
            isVegan: "",
            methods: [],
            recipeKeyword: "",
            time: ""
        }
    });

    const [items, setItems] = useState<any[]>([]);

    const [hasMore, sethasMore] = useState(true);

    const [page, setpage] = useState(1);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        const getComments = async () => {
            const res = await fetch(
                `${process.env.REACT_APP_API_HOST}/recipe/list/data?limit=10&page=0`
                // For json server use url below
                // `http://localhost:3004/comments?_page=1&_limit=20`
            );
            const data = await res.json();
            setItems(data.recipes);
            console.log(data);
        };

        getComments();
    }, []);

    const fetchComments = async () => {
        const res = await fetch(
            `${process.env.REACT_APP_API_HOST}/recipe/list/data?limit=10&page=${page}`
            // For json server use url below
            // `http://localhost:3004/comments?_page=${page}&_limit=20`
        );
        const data = await res.json();
        //console.log(data);
        return data.recipes;
    };

    const fetchData = async () => {
        const commentsFormServer = await fetchComments();

        setItems([...items, ...commentsFormServer]);
        if (commentsFormServer.length === 0 || commentsFormServer.length < 10) {
            sethasMore(false);
        }
        setpage(page + 1);
    };



    const onSubmit = async (data: SearchingFormType) => {
        const defaultValue = {
            ingredients: "",
            isVegan: "",
            methods: [],
            recipeKeyword: "",
            time: "",
            style: ""
        }
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

                console.log("no input")
                return

            }
            await callApi
            navigate("/result-page")

        } catch (err) {
            console.log(err)

        }

    }

    return <div className="container">

        <div className="header">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.searchBarContainer}>
                    <div className={styles.search}>
                        <img src={logo} alt="Icon" className="icon" />
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

        </div>

        <div className="main-container">
            <div className="scrol-title">最新發佈</div>
            <InfiniteScroll className="home-content"
                dataLength={items.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
                loader={<div className="loader-non-cover"><Spinner color='red.500' size='xl' /></div>}
                endMessage={<EndMsg />}
            >

                <div className="row m-2 infinite-scroll-container">
                    {items.map((item: any, index: number) => {
                        return <div key={index}><HomeCard item={item} />
                        </div>

                    })}
                </div>

            </InfiniteScroll>
        </div>
    </div>

}

