import pandas as pd

data = pd.read_csv("dummy.csv")
data[["ciudad"]].drop_duplicates().to_csv("location.csv", index = False)
data[['codProducto', 'producto']].drop_duplicates().to_csv("food.csv",
                                                              index = False)
