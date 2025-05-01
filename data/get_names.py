import pandas as pd

data = pd.read_csv("dummy.csv", on_bad_lines="skip",delimiter=";")
data[["DEPT_ID", "MUNI_ID", "ENAB_PROCEDENCIA",
      "V6"]].drop_duplicates().to_csv("location.csv", index = False)
data[['GRUP_NOMBRE', 'ARTI_NOMBRE']].drop_duplicates().to_csv("food.csv",
                                                              index = False)
