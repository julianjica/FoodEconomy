from zeep import Client, Settings, helpers
from zeep.transports import Transport
from requests import Session
import pandas as pd

session = Session()
session.headers.update({'Accept-Encoding': 'identity'})  # Disable chunked encoding
transport = Transport(session=session, timeout=60)  # Increase timeout

settings = Settings(strict=False, xml_huge_tree=True)
client = Client(wsdl='https://appweb.dane.gov.co/sipsaWS/SrvSipsaUpraBeanService?WSDL',
                transport=transport, settings=settings)

response = client.service.promediosSipsaSemanaMadr()
response = pd.DataFrame(helpers.serialize_object(response))
