import { lg } from "./__localGlobals";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { loadRandomAnim } from './__loadRandomAnim';
import { updateCurrentPage } from './__updateCurrentPage';
import { getTablePage } from './__getMetadataPage';


export function createLocalFilesBrowser(){
    console.log("createLocalFilesBrowser")

    lg.BROWSER_TYPE = "localFiles"

    const browser = document.getElementById("browser")!;
    browser.className = "flex flex-col h-full w-full"
    browser.innerHTML = /*html*/`
      <div class="flex flex-wrap m-2 gap-2 flex-initial items-center">
        <div class="relative grow basis-[8rem]">
            <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style="font-size: 18px;">search</span>
            <input spellcheck="false" id="tab-search-input" type="text" name="search" placeholder="Search for moves..." class="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:border-gray-400 focus:bg-white transition-colors">
        </div>

        <div class="w-px h-6 bg-gray-300"></div>

        <button id="tab-random" class="myicon p-1" title="Shuffle animation">
            <span class="material-symbols-outlined" style="font-size: 20px;">shuffle</span>
        </button>

        <button id="tab-search-desc" class="p-1 border border-gray-300 rounded-lg text-gray-400 hover:text-gray-900 transition-colors" title="Search in natural descriptions">
            <span class="material-symbols-outlined" style="font-size: 20px;">description</span>
        </button>

        </div>

        <table id="browser-table-header" class="w-full table-fixed flex-none"></table>
        <div class="flex-1 overflow-auto">
        <table id="browser-table" class="w-full table-fixed"></table>
        </div>

        <div class="flex flex-wrap m-2 gap-2 flex-none items-center justify-end">
            <span id="tab-total-moves" class="text-xs text-gray-400 whitespace-nowrap"></span>
            <div class="flex flex-row items-center gap-1 text-sm text-gray-500">
                <button id="tab-page-prev" class="myicon p-0.5 cursor-pointer" title="Previous page"><span class="material-symbols-outlined" style="font-size: 18px;">chevron_left</span></button>
                <input spellcheck="false" class="w-8 text-center text-sm border border-gray-300 rounded bg-white" type="number" id="tab-page" min="1" max="5" value="${lg.PAGE}" onKeyDown="checkLength(event)">
                <span id="tab-max-pages">/??</span>
                <button id="tab-page-next" class="myicon p-0.5 cursor-pointer" title="Next page"><span class="material-symbols-outlined" style="font-size: 18px;">chevron_right</span></button>
            </div>
        </div>
        `
    // <button id="browser-help" class="leading-[0]">
    //     <span class="material-symbols-outlined text-teal-500">
    //     help
    //     </span>
    // </button>
        
    // tippy('#browser-help', {
    //     content: /*html*/`
    //     <p>
    //     <strong>Performance tips</strong>: <br> 
    //     • When "use regex" is enabled, start your query with "^" character (meaning: "starts with"). E.g. "^scared". This is much faster than just "scared".<br>
    //     • "sort by date" can slow down queries. Disable it if you don't need it. <br>
    //     • Filtering by date range can also slow down queries. Disable it if you don't need it (leave the input fields blank). <br>
    //     </p>
    //     <br>
    //     <p> 
    //     <strong>Technical details</strong>: <br>
    //     • By default the whole rg.Moves collection is sorted by date, so the empty query will be sorted by date even with "sort by date" disabled. <br>
    //     • Queries are run against the "MOVE_viewer_search_field" field in rg.Moves. This field is a lowercase concatenation of "MOVE_name" and "MOVE_org_name" fields. <br>
    //     • All queries are case-insensitive for performance reasons. Regex "R_001__A450" is the same thing as "r_001__a450". <br>
    //     </p>
    //     `,
    //     allowHTML: true,
    // });

    //run getCSV() when input button has file
    document.getElementById("tab-random")!.onclick = loadRandomAnim

    const searchDescBtn = document.getElementById("tab-search-desc")!;
    const searchDescIcon = searchDescBtn.querySelector(".material-symbols-outlined")!;
    const updateSearchDescStyle = () => {
        if (lg.SEARCH_DESC) {
            searchDescBtn.classList.add("bg-bones", "border-bones", "text-gray-900");
            searchDescBtn.classList.remove("border-gray-300", "text-gray-400");
            searchDescIcon.style.fontVariationSettings = "'FILL' 1";
        } else {
            searchDescBtn.classList.remove("bg-bones", "border-bones", "text-gray-900");
            searchDescBtn.classList.add("border-gray-300", "text-gray-400");
            searchDescIcon.style.fontVariationSettings = "'FILL' 0";
        }
    };
    updateSearchDescStyle();
    searchDescBtn.onclick = () => {
        lg.SEARCH_DESC = !lg.SEARCH_DESC;
        updateSearchDescStyle();
    };
    // document.getElementById("tab-load-row").onclick = loadAnimFromSelectedRow


    document.getElementById("tab-page")!.addEventListener('change', (e) => {
        const val = parseInt((e.target as HTMLInputElement).value);
        
        // if not a number, return
        if (!val){
            return
        }
        
        updateCurrentPage(val)
        getTablePage()
    });

    const tab_search_input = document.getElementById("tab-search-input")!
    tab_search_input.addEventListener("keyup", ({ key }) => {
        if (lg.ISPROCESSINGFILTER){
            return
        }
        if (key === "Enter" ) {
            lg.QUERY = (tab_search_input as HTMLInputElement).value
            updateCurrentPage(1)
            getTablePage()
        }
    })

    document.getElementById("tab-page-prev")!.addEventListener("click", () => {
        if (lg.PAGE > 1) {
            updateCurrentPage(lg.PAGE - 1)
            getTablePage()
        }
    });
    document.getElementById("tab-page-next")!.addEventListener("click", () => {
        updateCurrentPage(lg.PAGE + 1)
        getTablePage()
    });


    // const tab_regex_button = document.getElementById("tab-regex")! //checkbox
    // tab_regex_button.addEventListener("change", () => {
    //     lg.REGEX_ON = (tab_regex_button as HTMLInputElement).checked
    //     updateCurrentPage(1)
    //     getTablePage()
    // });

    // const tab_dirpath_input = document.getElementById("tab-search-dirpath") as HTMLInputElement;
    // tab_dirpath_input.addEventListener("keyup", ({ key }) => {
    //     lg.DIRPATH = (tab_dirpath_input as HTMLInputElement).value
    // })
    
    getTablePage();

}