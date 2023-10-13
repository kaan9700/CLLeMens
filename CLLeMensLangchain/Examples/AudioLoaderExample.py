import speech_recognition as sr
import io
from pydub import AudioSegment
from pydub.silence import split_on_silence
from deepmultilingualpunctuation import PunctuationModel


model = PunctuationModel()

# create a speech recognition object
r = sr.Recognizer()



def transcribe_audio_chunk(audio_chunk):
    # Convert pydub.AudioSegment to a byte-like object
    buffer = io.BytesIO()
    audio_chunk.export(buffer, format="wav")
    buffer.seek(0)

    with sr.AudioFile(buffer) as source:
        audio_listened = r.record(source)
        try:
            text = r.recognize_google(audio_listened)
            return text
        except sr.UnknownValueError:
            return "[Unrecognized segment]"
        except sr.RequestError:
            return "[API Unavailable]"


def get_large_audio_transcription_on_silence(path):
    # open the audio file using pydub
    sound = AudioSegment.from_file(path)
    # split audio sound where silence is 700 milliseconds or more and get chunks
    chunks = split_on_silence(sound,
                              min_silence_len=700,
                              silence_thresh=sound.dBFS - 14,
                              keep_silence=500,
                              )

    whole_text = ""
    for audio_chunk in chunks:
        text = transcribe_audio_chunk(audio_chunk)
        whole_text += text + " "
    return whole_text


def capitalize_after_period(text):
    """
    Capitalize the first letter of a word after a period.
    """
    sentences = text.split('. ')
    sentences = [s.capitalize() for s in sentences]
    return '. '.join(sentences)

def add_punctuation(text):
    result = model.restore_punctuation(text)
    capitalized_result = capitalize_after_period(result)

    return capitalized_result


if __name__ == "__main__":
    filename = "../../290-trial-by-jury.mp3"
    transcribed_text = get_large_audio_transcription_on_silence(filename)
    punctuated_text = add_punctuation(transcribed_text)
    print("\nFull text with punctuation:", punctuated_text)

