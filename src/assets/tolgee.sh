# Tolgee Project ID
PROJECT_ID=7

# Directory to unzip the downloaded files
UNZIP_DIR="./"

TAGS="web"

# Tolgee command to download translation files
npx @tolgee/cli@latest pull \
	--api-url https://tolgee.dmz.channel.io \
	--api-key tgpak_g5pwoolqmfwwcobsmrswmnbxn5whcobqni2gqntem52gm \
	--project-id $PROJECT_ID \
	--format JSON_C \
	--path $UNZIP_DIR \
	--delimiter null \
	--tags $TAGS \
	--states UNTRANSLATED TRANSLATED REVIEWED