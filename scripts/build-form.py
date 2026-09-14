from pathlib import Path
import re,json
s=Path('public/forms/complete-referral-form.txt').read_text().replace('\u2028','\n')
heads=list(re.finditer(r'(?m)^(\d+)\. (.+)$',s))
sections=[]
for i,h in enumerate(heads):
 n=int(h[1]); body=s[h.end():heads[i+1].start() if i+1<len(heads) else len(s)].strip()
 body=re.split(r'\n(?:PART \d|STAFF SECTION|PROGRAM SECTION|CASE-NUMBER INSTRUCTIONS)',body)[0].strip()
 lines=body.splitlines(); blocks=[]; last=None; k=0
 def field(label,options=None,kind='text'):
  global last
  f={'id':f's{n}_f{sum(1 for b in blocks if b["type"]!="note")+1}','type':kind,'label':label.strip(' *'),'options':options or []}
  blocks.append(f);last=f;return f
 for line in lines:
  line=line.strip()
  if not line:continue
  if line.startswith('|'):
   if '---' in line or set(line.replace('|','').replace('_','').strip())==set():continue
   cols=[x.strip() for x in line.strip('|').split('|')]
   if all('____' in x for x in cols):continue
   field('Medication list — add each medicine',cols,'repeat');last=None;continue
  if '☐' in line:
   prefix=line.split('☐')[0].strip()
   if prefix: field(prefix.rstrip(':'))
   opts=[x.strip() for x in line.split('☐')[1:]]
   opts=[re.sub(r':?\s*_+','',o).strip() for o in opts]
   # choices immediately after a label, otherwise attach to the section title
   if last and last['type']!='repeat':
    last['options']+=opts;last['type']='choice'
   else:field(h[2],opts,'choice')
   continue
  if '____' in line or '$____' in line:
   # medication prose/table fields, and ordinary labeled lines
   label=re.sub(r'\s*\$?_+','',line).strip().rstrip(':')
   if re.fullmatch(r'[1-3]\.',label): label='Goal '+label[0]
   if not label:
    continue
   field(label);continue
  if line.endswith('?') or (line.endswith(':') and not re.match(r'(For each|Repeat|If |Staff|For important|Possible|Count these|For children|For school)',line)):
   field(line.rstrip(':'));continue
  if re.match(r'^(What |Which |Who |Where |How |Why |Anything |About when|Tell us only)',line):
   field(line);continue
  blocks.append({'type':'note','text':line})
  # Notes such as examples should not break a following option group.
 if n==24:
  # Keep one repeatable medication list; prose prompts remain in source but need not duplicate entry.
  a=next(j for j,b in enumerate(blocks) if b.get('label','').startswith('What is the medicine called'))
  z=next(j for j,b in enumerate(blocks) if b['type']=='repeat')
  blocks[a:z+1]=[{'id':'s24_medications','type':'repeat','label':'Your medicines','options':['Medicine name','Dose — how much each time','Frequency — how often','Purpose, if known','Prescriber/provider, if known','Taking now or having trouble getting it?']}]
 if n in [26,28]:
  for b in blocks:
   if b['type']=='repeat':b['label']='Other medicines not already listed';b['id']=f's{n}_medications'
 if n in [21,25,36,39]:
  for b in blocks:
   if b['type']=='text' and ((n==25 and b['id'] in [f's25_f{i}' for i in range(1,15)]) or (n in [21,36,39] and b.get('label') and any(line.startswith('* '+b['label']) for line in lines))):
    b['type']='choice'
    b['options']=(['Now','In the past','Both','No','Not sure','Skip'] if n in [21,25] else ['I can do this','Some help','A lot of help','Have not tried','Not interested right now'] if n==36 else ['I manage this','Some help','A lot of help','Does not apply','Not sure'])
 sections.append({'number':n,'title':h[2],'source':body,'blocks':blocks})
Path('lib/form-sections.json').write_text(json.dumps(sections,ensure_ascii=False,indent=2)+'\n')
print('Sections',len(sections),'Fields',sum(b['type']!='note' for x in sections for b in x['blocks']))
for x in sections:
 print(x['number'],[(b.get('id'),b.get('label'),len(b.get('options',[]))) for b in x['blocks'] if b['type']!='note'])
