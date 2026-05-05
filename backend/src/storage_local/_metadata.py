from pathlib import Path
from fastapi import APIRouter
import os
from storage_local.__local_helpers import get_matching_moves
from fastapi.responses import JSONResponse
from helpers import filter_metadata
from globals import Global

router = APIRouter()



@router.get("/{filename}")
def get_metadata(filename: str):
    """
    Get metadata for a move by its filename.
    """

    # get row where index is filename
    try:
        move =  Global.metadata.loc[filename].to_dict()
    except KeyError:        
        return JSONResponse(
            status_code=404, content={"error": "Move not found."}
        )
    
    move = filter_metadata(move)
    
    return move



@router.get("/")
def get_moves(
    # dirpath: str,
    page: int = 1,
    perpage: int = 1000,
    query: str = "",
    search_desc: bool = False,
):
    
    moves = get_matching_moves(query, search_desc=search_desc)
    
    # if no bvh found
    if len(moves) == 0:
        return {"result": [], "total": 0}
    
    num = len(moves)
    
    # get range of dataframe
    # moves =  moves[(page-1)*perpage:page*perpage]
    moves = moves.iloc[(page-1)*perpage:page*perpage]
    
    # convert to dict with two keys, renamed and reordered
    df = moves.reset_index()[["move_name", "filename"]]
    df = df.rename(columns={"move_name": "Move name", "filename": "Filename"})
    moves = df.to_dict(orient="records")
    
        
    return {"result": moves, "total": num}
