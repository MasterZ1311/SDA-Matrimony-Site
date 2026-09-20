from fastapi.testclient import TestClient
from app.main import app
from app.schemas.models import Profile
from app.services.compatibility import compatibility

client=TestClient(app)

def p(**kw): return Profile(**kw)

def test_weighted_score():
    a=p(id='a',baptism_status='yes',sabbath_observance='strict',doctrinal_alignment='aligned',church_conference='A',ministry=['music'],diet='vegan',education_level='masters',field_of_study='CS',university='Andrews')
    b=p(id='b',baptism_status='yes',sabbath_observance='strict',doctrinal_alignment='aligned',church_conference='A',ministry=['music'],diet='vegan',education_level='masters',field_of_study='CS',university='Andrews')
    assert compatibility(a,b)['score']==100

def test_health(): assert client.get('/health').json()['status']=='ok'
