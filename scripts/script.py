# -*- coding: utf-8 -*-
import csv, json, os
from IPython import embed

jingwei = [
('重庆', 106.549, 29.581),
('北京', 116.408, 39.904),
('上海', 121.445, 31.213),
('广州', 113.265, 23.108),
('武汉', 114.279, 30.573),
('济南', 117.009, 36.663),
('深圳', 114.109, 22.544),
('乌鲁木齐', 87.585, 43.781),
('兰州', 103.751, 36.068),
('南京', 118.769, 32.048),
('南宁', 108.295, 22.838),
('南昌', 115.889, 28.671),
('合肥', 117.275, 31.861),
('呼和浩特', 111.686, 40.819),
('哈尔滨', 126.645, 45.758),
('大连', 121.576, 38.944),
('天津', 117.246, 39.117),
('太原', 112.551, 37.893),
('成都', 104.071, 30.670),
# ('拉萨', 91.126, 29.656),  # 炸
('昆明', 102.702, 25.051),
('杭州', 120.165, 30.319),
('沈阳', 123.418, 41.799),
('石家庄', 114.498, 38.042),
# ('福州', 119.303, 26.071), # 炸
('西宁', 101.778, 36.621),
('贵阳', 106.700, 26.572),
('郑州', 113.641, 34.758),
('银川', 106.263, 38.468),
('长春', 125.324, 43.871),
('长沙', 112.967, 28.197),
('西安', 108.969, 34.285),
# ('秦皇岛', 119.601, 39.932),
# ('厦门', 118.070, 24.445),
('赣州', 114.916, 25.832),
('上饶', 117.956, 28.451),
('徐州', 117.188, 34.263),
('连云港', 119.167, 34.599),
('青岛', 120.343, 36.088),
('襄阳', 112.150, 32.180),
# # ('巴东', 110.312, 30.813),  # railway上没这个城市
# # ('乐山', 103.747, 29.564),
('怀化', 109.945, 27.553),
# ('汉中', 107.025, 33.071),
('广元', 105.819, 32.446),
('桂林', 110.277, 25.281),
('衡阳', 112.614, 26.902),
('包头', 109.809, 40.657),
# ('宜昌', 111.281, 30.708)
]

with open('keystations.txt', 'w', encoding='utf-8') as f:
    f.write(str([station for station, lng, let in jingwei]))

D = {'nodes':{}, 'links':[]}
for station, lng, lat in jingwei:
    D['nodes'][station] = [lng, lat]

citypair2railways = {}
with open('network.json', 'r') as f:
    D1 = json.load(f)
    for railway_name, D2 in D1.items():
        for i in range(len(D2['route'])-1):
            uu = D2['route'][i]
            vv = D2['route'][i+1]
            if (uu, vv) not in citypair2railways:
                tmp = vv
                vv = uu
                uu = tmp
            citypair2railways.setdefault((uu, vv), []).append({
                'name': railway_name,
                'date': D2['date'],
                'service': D2['service'],
                'electrification': D2['electrification']
            })
for k,v in citypair2railways.items():
    D['links'].append({
        'u': k[0],
        'v': k[1],
        'railways': v
    })

with open('../json/tmp.json', 'w') as f:
    # js = json.dumps(D, ensure_ascii=False)
    # shown in chinese character instead of \uxxx
    json.dump(D, f)