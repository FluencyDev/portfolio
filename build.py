#!/usr/bin/env python3
"""
build.py - propaga os partials compartilhados para dentro de cada pagina.

Le  partials/header.html  e  partials/footer.html  e substitui o trecho entre
os marcadores  <!-- HEADER:START --> / <!-- HEADER:END -->  e
<!-- FOOTER:START --> / <!-- FOOTER:END -->  de cada *.html da raiz do projeto
(nao entra em subpastas, entao partials/ e ignorado automaticamente).

Idempotente: rodar de novo sem editar os partials nao gera nenhum diff.

Uso:
    python3 build.py

Depois de editar partials/header.html ou partials/footer.html, rode este
comando e faca  git add  das paginas que ele listar como "updated".
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARTIALS = ROOT / "partials"

REGIONS = {
    "HEADER": PARTIALS / "header.html",
    "FOOTER": PARTIALS / "footer.html",
}

# versao em portugues: as paginas de pt/ usam partials/header.pt.html e
# partials/footer.pt.html (mesmos marcadores, caminhos com ../)
REGIONS_PT = {
    "HEADER": PARTIALS / "header.pt.html",
    "FOOTER": PARTIALS / "footer.pt.html",
}

# texto fixo que o build escreve no marcador START (o regex abaixo aceita
# qualquer texto ali, entao editar isso a mao nao quebra o build)
START_HINT = {
    "HEADER": "gerado de partials/header.html - nao edite aqui; rode: python3 build.py",
    "FOOTER": "gerado de partials/footer.html - nao edite aqui; rode: python3 build.py",
}


def region_regex(name):
    # <!-- NAME:START ...qualquer coisa... -->  ...corpo (inclui outros comentarios)...  <!-- NAME:END -->
    return re.compile(
        r"<!--\s*" + name + r":START\b.*?-->.*?<!--\s*" + name + r":END\s*-->",
        re.DOTALL,
    )


def canonical(name, body):
    body = body.strip("\n")
    return (
        "<!-- " + name + ":START - " + START_HINT[name] + " -->\n"
        + body + "\n"
        + "<!-- " + name + ":END -->"
    )


def main():
    bodies = {}
    for name, path in REGIONS.items():
        if not path.is_file():
            sys.exit("ERRO: " + str(path.relative_to(ROOT)) + " nao encontrado.")
        bodies[name] = path.read_text(encoding="utf-8")
    bodies_pt = {}
    for name, path in REGIONS_PT.items():
        if not path.is_file():
            sys.exit("ERRO: " + str(path.relative_to(ROOT)) + " nao encontrado.")
        bodies_pt[name] = path.read_text(encoding="utf-8")

    changed = []
    scanned = 0
    targets = [(h, bodies) for h in sorted(ROOT.glob("*.html"))]
    targets += [(h, bodies_pt) for h in sorted((ROOT / "pt").glob("*.html"))]
    for html, bodies in targets:
        scanned += 1
        original = html.read_text(encoding="utf-8")
        text = original
        for name in REGIONS:
            rx = region_regex(name)
            if rx.search(text) is None:
                print("  aviso: " + html.name + " sem marcadores " + name
                      + ":START/END - regiao ignorada")
                continue
            text = rx.sub(lambda m, n=name: canonical(n, bodies[n].replace("{{PAGE}}", html.name)), text, count=1)
        if text != original:
            html.write_text(text, encoding="utf-8")
            label = html.relative_to(ROOT).as_posix()
            changed.append(label)
            print("updated " + label)
        else:
            print("ok      " + html.relative_to(ROOT).as_posix())

    print("")
    if changed:
        print(str(len(changed)) + " de " + str(scanned) + " pagina(s) atualizada(s): "
              + ", ".join(changed))
    else:
        print(str(scanned) + " pagina(s) verificada(s), nada mudou.")


if __name__ == "__main__":
    main()
