// @flow
import * as _ from "lodash";
import type { ApiResponse, HomeBanner } from "./Model";

// type ByCities<T> = { [string]: T[] };
// type Callback = Home[] => void;

// eslint-disable-next-line max-len
const setting = "http://staging.koreawallpaper.com/api/setting";

export default class APIStore {

    // static listeners: Callback[] = [];
    // static saved: string[] = [];
    static data: ApiResponse;

    // static async load(): Promise<void> {

        // console.log("3");
        // const result = await fetch(setting);
        // const response = await result.json();
        // console.log(response);
        // alert(json);
        // APIStore.data = response
        // console.log(APIStore.data.banners);
        //   const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
        //   const json = await response.json();
        //   this.setState({ data: json });
    // }
    static async services(): HomeBanner {
        // APIStore.load();
        // console.log("1");
        // console.log("2");
        const result = await fetch(setting);
        const response = await result.json();
        // APIStore.data = response
        // console.log(APIStore.data);
        // console.log(APIStore.data.banners);
        //
        // console.log(APIStore.data.banners);
        // alert(APIStore.data);
        return response.banners;
    }

}
