from blockcontainer.celery import app

import feedparser
from bs4 import BeautifulSoup
from .models import Feed
import time
import re
import datetime

# Russian Detector

def russian_detector(text):
    return bool(re.search('[а-яА-Я]', text))

@app.task
def updateCoinScribble():
    url = "https://coinscribble.com/feed/"

    feeds = feedparser.parse(url)
    for feed in feeds.entries:
        feed_title = BeautifulSoup(feed.title, "html.parser").text
        feed_desc = BeautifulSoup(feed.description, "html.parser").text
        date_grabbed = BeautifulSoup(feed.published, "html.parser").text.strip(" +0000")
        match = re.search('(([0-9])|([0-2][0-9])|([3][0-1])) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:((\d{2})|(\d{1}))', date_grabbed).group()
        date = datetime.datetime.strptime(match,'%d %b %Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
        date_timestamp = time.mktime(time.strptime(date, "%Y-%m-%d %H:%M:%S"))

        if not russian_detector(feed_desc):
            if not Feed.objects.filter(title=feed.title).exists():
                Feed.objects.create(title=feed_title, url=feed.link, publisher="coinscribble.com", pubDate=date, timestamp=date_timestamp, description=feed_desc, language="en", keywords=["SPONSORED: coinscribble"])
                print("Post added")
            else:
                print("Post already exists")
        else:
            print("Detecting russian language.")


@app.task
def updateNews():
    urls = {
        "bitcoin" : "https://www.google.com/alerts/feeds/12340362945684051216/15655618752877247827",
        "blockchain" : "https://www.google.com/alerts/feeds/12340362945684051216/13114747021562294851",
        "aeternity" : "https://www.google.com/alerts/feeds/12340362945684051216/16440740884174862757",
        "binance" : "https://www.google.com/alerts/feeds/12340362945684051216/8027721639639490252",
        "bitcoin cash" : "https://www.google.com/alerts/feeds/12340362945684051216/17512606990530552971",
        "bytecoin" : "https://www.google.com/alerts/feeds/12340362945684051216/17980445981191647329",
        "bytom" : "https://www.google.com/alerts/feeds/12340362945684051216/7898063312297607721",
        "cardano" : "https://www.google.com/alerts/feeds/12340362945684051216/11585699988765018451",
        "crypto" : "https://www.google.com/alerts/feeds/12340362945684051216/16529425444757612249",
        "crypto hack" : "https://www.google.com/alerts/feeds/12340362945684051216/2362755211162792231",
        "crypto manipulation" : "https://www.google.com/alerts/feeds/12340362945684051216/2144901627350877709",
        "crypto regulation" : "https://www.google.com/alerts/feeds/12340362945684051216/2144901627350876711",
        "dash" : "https://www.google.com/alerts/feeds/12340362945684051216/1147869376182928107",
        "eos" : "https://www.google.com/alerts/feeds/12340362945684051216/2871138225825499714",
        "ethereum" : "https://www.google.com/alerts/feeds/12340362945684051216/13038099722634464383",
        "ethereum classic" : "https://www.google.com/alerts/feeds/12340362945684051216/1135553200736887840",
        "icon" : "https://www.google.com/alerts/feeds/12340362945684051216/1138440253232776667",
        "iota" : "https://www.google.com/alerts/feeds/12340362945684051216/10370891387368167962",
        "lisk" : "https://www.google.com/alerts/feeds/12340362945684051216/17111995700909466580",
        "litecoin" : "https://www.google.com/alerts/feeds/12340362945684051216/17133084124967421676",
        "monero" : "https://www.google.com/alerts/feeds/12340362945684051216/12261175556563009446",
        "nem" : "https://www.google.com/alerts/feeds/12340362945684051216/7720578290498420253",
        "neo" : "https://www.google.com/alerts/feeds/12340362945684051216/2775565315315977746",
        "omise" : "https://www.google.com/alerts/feeds/12340362945684051216/10193091974408175944",
        "ontology" : "https://www.google.com/alerts/feeds/12340362945684051216/13233149221754639791",
        "qtum" : "https://www.google.com/alerts/feeds/12340362945684051216/4141064930560135343",
        "ripple" : "https://www.google.com/alerts/feeds/12340362945684051216/11104048133686601400",
        "stellar" : "https://www.google.com/alerts/feeds/12340362945684051216/3410338781824721132",
        "tether" : "https://www.google.com/alerts/feeds/12340362945684051216/12658500746063410704",
        "tron" : "https://www.google.com/alerts/feeds/12340362945684051216/3498726207950265081",
        "vechain" : "https://www.google.com/alerts/feeds/12340362945684051216/7720578290498419823",
        "zcash" : "https://www.google.com/alerts/feeds/12340362945684051216/3787959852648023990",
        "zilliqa" : "https://www.google.com/alerts/feeds/12340362945684051216/3787959852648023756",
    }


    #print("Get News Data")
    #url = "https://news.google.com/news?pz=1&cf=all&ned=en&hl=us&q=bitcoin&cf=all&output=rss"


    for key, url in urls.items():
        feeds = feedparser.parse(url)
        for feed in feeds.entries:
            __day = feed.published.partition("T")[0]
            __time = feed.published.partition("T")[2].partition("Z")[0]
            __pubDate = __day+" "+__time
            __timestamp = time.mktime(time.strptime(__day+" "+__time, "%Y-%m-%d %H:%M:%S"))
            __url = feed.link.partition("&url=")[2].partition("&ct=")[0]
            __title = BeautifulSoup(feed.title, "html.parser").text

            __publisher =  __url.partition("https://")[2].partition("/")[0]
            if not __publisher:
                __publisher =  __url.partition("http://")[2].partition("/")[0]

            __description = BeautifulSoup(feed.description, "html.parser").text.replace(__publisher, "").partition("...")[0]+"..."
            soup = BeautifulSoup(feed.description, "html.parser")

            if not Feed.objects.filter(title=__title).exists():
                Feed.objects.create(title=__title, url=__url, publisher=__publisher, pubDate=__pubDate, timestamp=__timestamp, description=__description, language="en", keywords=[key])
                print("News added")
            else:
                obj = Feed.objects.get(title=__title)
                if key in obj.keywords:
                    print("News already exists")
                else:
                    obj.keywords.append(key)
                    obj.save()
                    print("Keyword added")
    return 1