scp build/full-text-index.json grunnkart@hydra:/dockerdata/nin-lookup-api/
scp build/metabase.json grunnkart@hydra:~/
ssh grunnkart@hydra node extract-meta.js metabase.json
scp build/NN-LA.json grunnkart@hydra:~/tilesdata/Natur_i_Norge/Landskap/metadata_med_undertyper.json
scp build/NN-NA.json grunnkart@hydra:~/tilesdata/Natur_i_Norge/Natursystem/metadata_med_undertyper.json
scp build/AO.json grunnkart@hydra:~/tilesdata/Fylke/metadata_med_undertyper.json
scp build/AR.json grunnkart@hydra:~/tilesdata/Biota/metadata_med_undertyper.json
scp build/VV.json grunnkart@hydra:~/tilesdata/Naturvernområde/metadata_med_undertyper.json
scp build/OR.json grunnkart@hydra:~/tilesdata/Datakilde/metadata_med_undertyper.json
scp build/RL.json grunnkart@hydra:~/tilesdata/Truet_art_natur/metadata_med_undertyper.json
scp build/mediakilde.json grunnkart@hydra:~/tilesdata/

ssh grunnkart@hydra cp ./metabase.json ./tilesdata/metadata_med_undertyper.json 
ssh grunnkart@hydra cp ./metabase.json /dockerdata/punkt-oppslag-api/build

ssh grunnkart@hydra docker restart nin-lookup-api
ssh grunnkart@hydra docker restart punkt-oppslag-api

