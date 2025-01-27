import unicodedata


f=open("br-utf8.txt", "r", encoding="utf-8")
l = []
for i in f:
    i = i.strip()
    if len(i)>2:
        #retirar acento
        i = unicodedata.normalize('NFD', i )
        i = ''.join(c for c in i if unicodedata.category(c) != 'Mn')
        l.append(i.strip())

h = open("br2.txt", "w", encoding="utf-8")
h.write(str(l))
f.close()