<#
.SYNOPSIS
  Crée ou lance un exercice du cahier dans un langage donné.
.EXAMPLE
  .\exo.ps1 nouveau rust 6       # crée exercices\rust\ex06
  .\exo.ps1 lancer  rust 6       # compile et exécute
  .\exo.ps1 lancer  java 1 24 18 # arguments transmis au programme
  .\exo.ps1 nouveau go es        # identifiants non numériques : es, f1, c1, bd1...
#>
param(
  [Parameter(Mandatory, Position = 0)][ValidateSet("nouveau", "lancer")] [string]$Action,
  [Parameter(Mandatory, Position = 1)][ValidateSet("java", "python", "c", "cpp", "go", "rust")] [string]$Langage,
  [Parameter(Mandatory, Position = 2)] [string]$Exo,
  [Parameter(ValueFromRemainingArguments)] [string[]]$Arguments = @()
)
$ErrorActionPreference = "Stop"

# Accents corrects dans la console Windows.
[Console]::OutputEncoding = [Text.Encoding]::UTF8
[Console]::InputEncoding  = [Text.Encoding]::UTF8
$env:PYTHONUTF8 = "1"

$racine  = Join-Path $PSScriptRoot "exercices\$Langage"
$nom     = if ($Exo -match '^\d+$') { "ex{0:D2}" -f [int]$Exo } else { "ex-$($Exo.ToLower())" }
$dossier = Join-Path $racine $nom

function Ecrire($chemin, $texte) {
  New-Item -ItemType Directory -Force (Split-Path $chemin) | Out-Null
  [IO.File]::WriteAllText($chemin, $texte, [Text.UTF8Encoding]::new($false))  # UTF-8 sans BOM
}

if ($Action -eq "nouveau") {
  if (Test-Path $dossier) { throw "$dossier existe déjà." }
  switch ($Langage) {
    "java" { Ecrire "$dossier\Main.java" @"
// Exercice $Exo
public class Main {
    public static void main(String[] args) {
        System.out.println("Exercice $Exo");
    }
}
"@ }
    "python" { Ecrire "$dossier\main.py" @"
"""Exercice $Exo"""


def main() -> None:
    print("Exercice $Exo")


if __name__ == "__main__":
    main()
"@ }
    "c" { Ecrire "$dossier\main.c" @"
/* Exercice $Exo */
#include <stdio.h>

int main(void) {
    printf("Exercice $Exo\n");
    return 0;
}
"@ }
    "cpp" { Ecrire "$dossier\main.cpp" @"
// Exercice $Exo
#include <iostream>

int main() {
    std::cout << "Exercice $Exo\n";
}
"@ }
    "go" { Ecrire "$dossier\main.go" @"
// Exercice $Exo
package main

import "fmt"

func main() {
	fmt.Println("Exercice $Exo")
}
"@ }
    "rust" {
      Ecrire "$dossier\Cargo.toml" @"
[package]
name = "$nom"
version = "0.1.0"
edition = "2021"

[dependencies]
"@
      Ecrire "$dossier\src\main.rs" @"
// Exercice $Exo
fn main() {
    println!("Exercice $Exo");
}
"@ }
  }
  Write-Host "Créé : $dossier" -ForegroundColor Green
  return
}

# ── lancer ──
if (-not (Test-Path $dossier)) { throw "$dossier n'existe pas. Crée-le avec : .\exo.ps1 nouveau $Langage $Exo" }
$sortie = Join-Path $dossier "out"

function Verifier { if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }

switch ($Langage) {
  "java" {
    $sources = @(Get-ChildItem $dossier -Recurse -Filter *.java | Where-Object FullName -notlike "$sortie*" | ForEach-Object FullName)
    javac -encoding UTF-8 -d $sortie @sources; Verifier
    java "-Dstdout.encoding=UTF-8" "-Dsun.stdout.encoding=UTF-8" -cp $sortie Main @Arguments
  }
  "python" { py (Join-Path $dossier "main.py") @Arguments }
  { $_ -in "c", "cpp" } {
    New-Item -ItemType Directory -Force $sortie | Out-Null
    $ext = if ($Langage -eq "c") { "*.c" } else { "*.cpp" }
    $sources = @(Get-ChildItem $dossier -Recurse -Filter $ext | ForEach-Object FullName)
    $exe = Join-Path $sortie "prog.exe"
    # -static : sinon les .exe ne trouvent pas les DLL de MinGW au lancement.
    if ($Langage -eq "c") { gcc -std=c17 -Wall -Wextra -g -static -pthread @sources -o $exe -lm }
    else                  { g++ -std=c++20 -Wall -Wextra -g -static -pthread @sources -o $exe }
    Verifier
    & $exe @Arguments
  }
  "go" {
    Push-Location $racine
    try { go run "./$nom" @Arguments } finally { Pop-Location }
  }
  "rust" {
    Push-Location $racine
    try { cargo run -q -p $nom -- @Arguments } finally { Pop-Location }
  }
}
exit $LASTEXITCODE
