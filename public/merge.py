import json

with open('radar.json', 'r') as f:
    radar = json.load(f)

with open('notes.json', 'r') as f:
    notes = json.load(f)


for music_name, v in notes.items():
    if music_name in radar:
        pass
    else:
        radar[music_name] = {}

    for difficulty, value in v.items():
        if difficulty in radar[music_name]:
            # 登録済みのためスキップ
            pass
        else:
            radar[music_name][difficulty] = {
                'ALL_NOTES': 0,
                'RADAR': {
                    "NOTES": value
                }
            }

print(json.dumps(radar, indent=4, ensure_ascii=False))
