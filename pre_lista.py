import pandas as pd, os

lista = pd.read_csv('~/Bulk/Scripts/gedae/cata_materias/201701.csv')

inter = pd.concat([
    pd.Series(lista['inicio'].str.split(':').apply(lambda x: int(x[0])*60 + int(x[1]) - 240),name='HR_INI'),
    pd.Series(lista['fim'].str.split(':').apply(lambda x: int(x[0])*60 + int(x[1]) - 240),name='HR_FIM')
],axis=1)
inter['DURACAO'] = inter['HR_FIM'] - inter['HR_INI']

cut_mnh = 240 - 240
cut_tar = 720 - 240
cut_nte = 1140 - 240

lista['pct_mnh'] = inter.apply(axis=1,func=lambda x: max(0,min(x['HR_FIM'],cut_tar)-x['HR_INI'])/float(x['DURACAO']))
lista.loc[inter['HR_FIM']>1440,'pct_mnh'] = inter.apply(axis=1,func=lambda x: (x['HR_FIM']-1440)/float(x['DURACAO']))
lista['pct_tar'] = inter.apply(axis=1,func=lambda x: max(0,min(x['HR_FIM'],cut_nte)-max(x['HR_INI'],cut_tar))/float(x['DURACAO']))
lista['pct_nte'] = inter.apply(axis=1,func=lambda x: max(0,min(x['HR_FIM'],24*60)-max(x['HR_INI'],cut_nte))/float(x['DURACAO']))

lista['periodo'] = ''
lista.loc[lista['pct_nte']>.5,'periodo'] = 'Noite'
lista.loc[lista['pct_tar']>.5,'periodo'] = 'Tarde'
lista.loc[lista['pct_mnh']>.5,'periodo'] = 'Manhã'
lista['periodo'].value_counts()

lista = lista[['departamento','sigla','titulo','turma','desc','link','dia','periodo','professor','inicio','fim']]

lista['professor'].replace({'^\(R\)':''},regex=True,inplace=True)

lista.groupby(['turma','sigla'])['turma'].count().value_counts()

lista['aula'] = pd.Series(lista.groupby(['sigla','turma'])['turma'].expanding().count().sort_index(level=2).values.astype('int'),index=lista.index)

lista = lista.set_index(['departamento','sigla','titulo','turma','desc','link']).pivot(columns='aula')

lista.columns = ['aula'+str(pair[1])+'_'+str(pair[0]) for pair in lista.columns.values]
lista.reset_index(inplace=True)

lista.columns

lista.to_json('/media/fernando/Bulk/Scripts/gedae/cata_materias/lista.js','records')
os.system("sed -i '1s/^/var lista = /' lista.js")
