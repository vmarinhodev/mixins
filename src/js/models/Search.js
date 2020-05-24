import axios from 'axios';
import {key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults(page = 1) {
        try {
            const res = await axios(`https://www.thecocktaildb.com/api/json/v1/1/search.php?key=${key}&s=${this.query}&type=drink&page=${page}`);
            this.result = res.data.drinks;
            this.page = page;
        } catch (error) {
            alert(error)
        }
        
    }
}