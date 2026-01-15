import os
from dotenv import load_dotenv
import lyricsgenius
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import re
import streamlit as st

load_dotenv()

GENIUS_TOKEN = os.getenv("GENIUS_TOKEN")
genius = lyricsgenius.Genius(GENIUS_TOKEN)

st.title("Lyrics Word Cloud Generator")

song_name = st.text_input("Name of Song")
artist_name = st.text_input("Name of Artist")

if st.button("Generate Word Cloud"):
    if song_name and artist_name:
        with st.spinner("Searching for lyrics..."):
            song = genius.search_song(song_name, artist_name)
            
            if song:
                lyrics = song.lyrics
                lyrics = re.sub(r'\[.*?\]', '', lyrics)
                
                wordcloud = WordCloud(width=800, height=400, background_color='white').generate(lyrics)
                
                fig, ax = plt.subplots(figsize=(15, 7))
                ax.imshow(wordcloud, interpolation='bilinear')
                ax.axis('off')
                
                st.pyplot(fig)
            else:
                st.error("Song not found. Please check the song name and artist.")
    else:
        st.warning("Please enter both song name and artist name.")
