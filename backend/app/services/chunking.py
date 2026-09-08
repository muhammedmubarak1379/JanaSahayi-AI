def split_text(text:str,chunk_size:int=200,overlap:int=30,)->list[str]:
    words = text.split()

    if not words:
        return []
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be zero or smaller than chunk_size")

    chunks:list[str]=[]
    start=0

    while start<len(words):
        end= min(start + chunk_size, len(words))
        chunk_words = words[start:end]
        chunk = " ".join(chunk_words)
        chunks.append(chunk)

        if end==len(words):
            break

        start=end-overlap

    return chunks