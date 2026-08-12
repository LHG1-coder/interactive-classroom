import json, re

data = json.load(open(r'D:/11/xwy/interactive-classroom/_ds_qbank.json', encoding='utf-8'))

def detex(s):
    if not s:
        return s
    s = s.replace(r'\(', '').replace(r'\)', '')
    s = s.replace(r'\_', '_')
    s = s.replace(r'\cdot', '\u00b7')
    s = s.replace(r'\leq', '\u2264').replace(r'\ge', '\u2265')
    s = s.replace(r'\approx', '\u2248')
    s = re.sub(r'\\frac\{([^{}]*)\}\{([^{}]*)\}', r'(\1)/(\2)', s)
    s = s.replace(r'\begin{bmatrix}', '[').replace(r'\end{bmatrix}', ']')
    s = re.sub(r'\\\\', ' ', s)   # matrix row sep (two backslashes)
    s = s.replace(r'&', ' ')      # matrix col sep
    s = s.replace('\\', '')        # leftover backslashes
    return s

for q in data:
    q['q'] = detex(q['q'])
    q['a'] = detex(q['a'])

js = "// 数据结构(严蔚敏版) 分章节习题全集\n"
js += "// 按难度编排序号(B基础 / M中档 / H拔高)，去除章节分组；ch 仅作原章号参考\n"
js += "// 字段: id 题号 | d 难度(easy/medium/hard) | kp 知识点(章主题) | ch 原章号 | q 题干 | a 答案(含代码/解析)\n"
js += "const dsQuestions = "
js += json.dumps(data, ensure_ascii=False, indent=1)
js += ";\n\n"
js += "const dsDiffLabel = {easy:'基础', medium:'中档', hard:'拔高'};\n"
js += "const dsDiffColor = {easy:'#10b981', medium:'#f59e0b', hard:'#ef4444'};\n"

with open(r'D:/11/xwy/interactive-classroom/ds-questions.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("regenerated ds-questions.js, bytes:", len(js))
for i in ['B-01', 'B-04', 'B-06', 'M-04', 'H-01', 'B-60']:
    q = next(x for x in data if x['id'] == i)
    print(i, '| Q:', q['q'][:55], '| A:', q['a'][:70].replace('\n', ' '))
