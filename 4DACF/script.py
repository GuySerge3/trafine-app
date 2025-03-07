import pandas as pd
import numpy as np
import hashlib

# Charger le dataset
df = pd.read_csv("dataset_projet_evaluation.csv", encoding="utf-8")

# 1. Pseudonymisation des noms et prénoms en utilisant un identifiant unique basé sur un hash
df['ClientID'] = df.apply(lambda row: hashlib.sha256((row['Nom'] + row['Prénom']).encode('utf-8')).hexdigest(), axis=1)

# 2. Anonymisation des emails en utilisant un hash
df['Email'] = df['Email'].apply(lambda x: hashlib.sha256(x.encode('utf-8')).hexdigest())  # Hash des emails

# 3. Agrégation des âges en tranches
age_bins = [18, 30, 40, 50, 60, 100]
age_labels = ['18-30', '31-40', '41-50', '51-60', '60+']
df['TrancheAge'] = pd.cut(df['Âge'], bins=age_bins, labels=age_labels)

# 4. Remplacement des valeurs manquantes par la médiane
df['Âge'] = df['Âge'].fillna(df['Âge'].median())  # Remplacement des NaN par la médiane de l'âge

# 5. Harmonisation des dates au format 'yyyy-mm-dd'
df['DateNaissance'] = pd.to_datetime(df['DateNaissance'], errors='coerce').dt.strftime('%Y-%m-%d')

# 6. Suppression des doublons
df.drop_duplicates(inplace=True)

# 7. Anonymisation de l'adresse en appliquant un hash à chaque ligne d'adresse
df['Adresse'] = df['Adresse'].apply(lambda x: hashlib.sha256(x.encode('utf-8')).hexdigest())

# 8. Anonymisation des autres informations sensibles comme le téléphone et le numéro de carte
df['Téléphone'] = df['Téléphone'].apply(lambda x: hashlib.sha256(x.encode('utf-8')).hexdigest())
df['NuméroCarteCrédit'] = df['NuméroCarteCrédit'].apply(lambda x: hashlib.sha256(x.encode('utf-8')).hexdigest())

# 9. Création d'une colonne pour le montant total dépensé par client
df['TotalDépensé'] = df.groupby('ClientID')['MontantTotalAchats'].transform('sum')

# 10. Identifier les anomalies (transactions trop élevées)
moyenne_achats = df['MontantTotalAchats'].mean()
df['Anomalie'] = df['MontantTotalAchats'] > moyenne_achats * 2  # Transactions anormales = plus de 2x la moyenne

# 11. Indicateur de fréquence d'achats
df['AchatsPlusDe5'] = df.groupby('ClientID')['MontantTotalAchats'].transform('count') > 5  # Clients avec plus de 5 achats

# Affichage des premières lignes du dataset après anonymisation et transformation
print(df.head())
