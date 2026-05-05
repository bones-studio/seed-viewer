import {BrowserType} from "./__types"
import {g} from "../globals.ts"

export const lg: {
    ISPROCESSINGFILTER: boolean,
    QUERY: string,
    SORTBYDATE: boolean,
    PAGE: number,
    PERPAGE: number,
    MAXPAGES: number,
    VERSION: string,
    CONTROLLER: AbortController | null,
    SIGNAL: AbortSignal | null,
    CASE_INSENSITIVE: boolean,
    DATE_FROM: string,
    DATE_TO: string,
    REGEX_ON: boolean,
    DIRPATH: string,
    BROWSER_TYPE: BrowserType,
    SEARCH_DESC: boolean

} = {
    ISPROCESSINGFILTER: false,
    QUERY: "",
    SORTBYDATE: false,
    PAGE: 1,
    PERPAGE: 1000,
    MAXPAGES: 1,
    VERSION: "v1",
    CONTROLLER: null,
    SIGNAL: null,
    CASE_INSENSITIVE: false,
    DATE_FROM: "",
    DATE_TO: "",
    REGEX_ON: false,
    DIRPATH: "",
    BROWSER_TYPE: g.DEFAULT_BROWSER_MODE,
    SEARCH_DESC: false
}