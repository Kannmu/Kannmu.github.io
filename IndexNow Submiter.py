import requests

# Defining the URL and the data for the POST request
url = "https://api.indexnow.org/IndexNow"
headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Host": "api.indexnow.org"
}
data = {
    "host": "kannmu.github.io",
    "key": "efa24de7d51947398d9d86fd104da054",
    "keyLocation": "https://kannmu.github.io/efa24de7d51947398d9d86fd104da054.txt",
    "urlList": [
        "https://kannmu.github.io/"
        "https://kannmu.github.io/2024/09/06/Camera-Market/",
        "https://kannmu.github.io/2024/08/25/Modified-GPU-Driver-Install/",
        "https://kannmu.github.io/2024/08/16/Python-Efficiency/",
        "https://kannmu.github.io/2024/03/02/Screen-Light/",
        "https://kannmu.github.io/2024/03/01/OpenMonitor/",
        "https://kannmu.github.io/2023/12/16/OpenViBE/",
        "https://kannmu.github.io/2023/06/05/UnityShader-Edge-Glowing/",
        "https://kannmu.github.io/2023/11/05/Steam-gama-data-visualization/",
        "https://kannmu.github.io/2023/11/25/One-possible-principle-of-meditation/",
        "https://kannmu.github.io/2023/08/27/VoiceRecognition/",
        "https://kannmu.github.io/2023/06/14/USB-HUB/",
        "https://kannmu.github.io/2023/06/10/Unity-Python-Interaction/",
        "https://kannmu.github.io/2023/12/15/OpenGL-Learning/",
        "https://kannmu.github.io/Portfolio/"
    ]
}

# Function to send the POST request
def send_post_request(url, headers, data):
    response = requests.post(url, headers=headers, json=data)
    return response

# Sending the request and capturing the response
# (Note: This code won't actually execute the request in this environment, but it's set up to do so in a normal Python environment.)
response = send_post_request(url, headers, data)
print(response.status_code, response.text)

