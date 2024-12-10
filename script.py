import re 
import os

archivo = open("manifest.txt", "r")
archivoYML = open("manifest.yml", "w")
for linea in archivo.readlines():
    patron = re.compile(r'\$+\{[a-zA-Z_0-9]+\}')
    patron_env = re.compile(r'[a-zA-Z_0-9]') 
    mo = patron.search(linea)
    if len(linea) >0 :
        if mo is None :
            lineaNew= linea
        else :
            mo2 = mo.group(0).strip('$')
            mo2 = mo2.strip('{')
            mo2 = mo2.strip('}')
            env = os.environ[mo2]
            lineaNew = linea.replace(mo.group(0), env)
    else :
        lineaNew= linea 
    archivoYML.write(lineaNew)
archivoYML.close()
archivo.close() 