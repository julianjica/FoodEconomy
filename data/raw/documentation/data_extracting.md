### Data Source and Category Mapping

I initially accessed the data through a SOAP protocol, which allows structured requests to retrieve information. However, the response did not include category names directly. Based on this, I assumed the categories are the same as those found in the following dataset:

> [DANE SIPSA Microdata Catalog](https://microdatos.dane.gov.co/index.php/catalog/645/get-microdata)

To proceed, I saved the retrieved data as `dummy.csv` and used a script named `get_names.py` to extract the category names corresponding to each class.

