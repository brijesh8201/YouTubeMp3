from PyQt5.QtWebEngineWidgets import QWebEngineView

import sys
from PyQt5.QtCore import Qt, QUrl
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton

app = QApplication(sys.argv)

window = QMainWindow()
window.setGeometry(100, 100, 800, 600)
window.setWindowTitle("My Website Desktop App")

# # Download the website's favicon and set it as the window icon
# favicon_url = "https://your-website-url.com/favicon.ico"
# favicon_data = requests.get(favicon_url).content
# icon = QIcon()
# icon.addFileData(favicon_data)
# window.setWindowIcon(icon)

browser = QWebEngineView()
browser.setUrl(QUrl("https://mp3youtube.vercel.app"))
window.setCentralWidget(browser)

# Back and Forward buttons
forward_button = QPushButton("►")
forward_button.clicked.connect(browser.forward)
back_button = QPushButton("◄")
back_button.clicked.connect(browser.back)


back_button.setFixedHeight(20)
forward_button.setFixedHeight(20)
back_button.setFixedWidth(45)
forward_button.setFixedWidth(45)
forward_button.setGeometry(45, 0, 50, 40)

back_button.setStyleSheet(
                            "QPushButton"
                             "{"
                             "color:white;"
                             "}"
                            "QPushButton"
                             "{"
                             "background-color:blue;"
                             "}"
                             "QPushButton::pressed"
                             "{"
                             "background-color :lightblue;"
                             "}"
                             ) 
                             
forward_button.setStyleSheet(
                            "QPushButton"
                             "{"
                             "color:white;"
                             "}"
                            "QPushButton"
                             "{"
                             "background-color:green;"
                             "}"
                             "QPushButton::pressed"
                             "{"
                             "background-color :gray;"
                             "}"
                             ) 

 
# Enable or disable buttons based on navigation history
browser.urlChanged.connect(lambda url: forward_button.setEnabled(browser.history().canGoForward()))
browser.urlChanged.connect(lambda url: back_button.setEnabled(browser.history().canGoBack()))

# Create a layout for the buttons
backbutton_layout = window.layout()
backbutton_layout.addWidget(forward_button)

button_layout = window.layout()
button_layout.addWidget(back_button)

window.show()
sys.exit(app.exec_())
