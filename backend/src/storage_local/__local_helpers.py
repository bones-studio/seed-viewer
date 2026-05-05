import re
from globals import Global
import pandas as pd

CACHE = {}

def get_matching_moves(query:str, search_desc:bool = False) -> pd.DataFrame:
    "find all rows in the Global.metadata whose index or move_name match the query"

    cache_key = f"{query}|desc={search_desc}"
    if cache_key in CACHE:
        return Global.metadata.loc[CACHE[cache_key]]

    if query != "":
            idx_match = Global.metadata.index.str.contains(query, flags=re.IGNORECASE)
            if "move_name" in Global.metadata.columns:
                name_match = Global.metadata["move_name"].fillna("").str.contains(query, flags=re.IGNORECASE)
                combined = idx_match | name_match
            else:
                combined = idx_match

            if search_desc:
                desc_cols = [c for c in Global.metadata.columns if c.startswith("content_natural_desc_")]
                for col in desc_cols:
                    col_match = Global.metadata[col].fillna("").str.contains(query, flags=re.IGNORECASE)
                    combined = combined | col_match

            matched = Global.metadata[combined]
    else:
        matched = Global.metadata

    # Sort by take_date descending (most recent first), then by index
    if "take_date" in matched.columns:
        matched = matched.sort_values("take_date", ascending=False, kind="stable")

    mons = matched.index.tolist()
    CACHE[cache_key] = mons

    return Global.metadata.loc[mons]

