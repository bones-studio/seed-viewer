import {lg} from "./__localGlobals"
import {g} from "../globals"
import {updateMaxPages} from "./__updateMaxPages"
import {refreshBrowserTable} from "./__refreshBrowserTable"
import {isOk} from "../helpers"
import {loadAnimFromSelectedRow} from "./__loadAnimFromSelectedRow"


export async function getTablePage() {
    g.SPINNER.show()
    lg.ISPROCESSINGFILTER = true;
    
    let url:string;
    if (lg.BROWSER_TYPE === "localFiles") {
        url = `${g.BACKEND_URL}/storage_local/metadata/?` +
            `page=${lg.PAGE}&` +
            `perpage=${lg.PERPAGE}&` +
            `query=${lg.QUERY}&` +
            `regex=${lg.REGEX_ON}&` +
            `search_desc=${lg.SEARCH_DESC}`
    }
    else {
        alert("BUG: Unknown browser type")
        return
    }
    
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(isOk)
        .then(data => {
            updateMaxPages(data.total);
            return data.result;
        })
        .catch(err => {
            console.error(err);
            alert(err)
            return [{ Error: "An error occurred while fetching data"}];
        })
        .finally(() => {
            g.SPINNER.hide();
            lg.ISPROCESSINGFILTER = false;
        });


    // assert is list
    if (!Array.isArray(res)) {
        alert("Browser Error: Expected array of objects. Contact admin")
        return;
    }

    // is empty
    if (res.length === 0) {
        // alert("No results found")
        refreshBrowserTable(["No results found"], [{ "No results found": "No results found" }])
    } else {
        //// keys to columns, excluding Filename (internal use only)
        const columns = Object.keys(res[0]).filter(k => k !== "Filename")
        refreshBrowserTable(columns, res)

        // Auto-load first animation if none is loaded (SOMA/G1 startup, or after model switch)
        if (g.MODEL3D && !g.MODEL3D.anim && res[0].Filename) {
            loadAnimFromSelectedRow(res[0].Filename);
        }
    }

}