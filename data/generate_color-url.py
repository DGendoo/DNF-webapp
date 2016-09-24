import urllib.request
import json
import colorsys
import random
from bs4 import BeautifulSoup

# pip3 install BeautifulSoup4.
# drug name is the name of the drug.
# probably need to load the json using json. then just do parsing and inserting elements
# to access a json's node just treat the data return by load_json as a dictionary

def is_result(tag):
	if tag.name == 'div':
		if tag.get('class') and tag['class'][0] == 'rprt':
			return True
		else:
			return False
	return False

def load_json(filename):
	f = open(filename,'r') 
	data = json.load(f)
	return data

def get_link(drug_name):
	print(drug_name)
	search_page_str = urllib.request.urlopen("https://www.ncbi.nlm.nih.gov/pccompound/?term=" + drug_name).read()
	soup = BeautifulSoup(search_page_str, "html.parser")
	tag = soup.find(is_result)
	if (tag == None):
		print("No such value!")
		return 'null'
	else:
		print(tag.contents[1].contents[0]['href'])
		return 'https:' + tag.contents[1].contents[0]['href']

def write_json(filename, json_data):
	with open(filename+'.new', 'w') as outfile:
		json.dump(json_data, outfile)

def load_data(filename):
	return_dict = {}
	origin_json =  load_json(filename)
	num_of_cluster = len(origin_json['element'])
	hue = [x * 360.0/num_of_cluster for x in range(num_of_cluster)]
	for each_cluster in origin_json['element']:
		i = random.randint(0,len(hue)-1)
		color = colorsys.hsv_to_rgb(hue[i]/360.0,1.0,1.0)
		color = (int(color[0] * 255), int(color[1] * 255), int(color[2] * 255))
		del hue[i]
		for each_node in origin_json['element'][each_cluster]['nodes']:
			drug_name = each_node['data']['id']
			url = get_link(drug_name)
			if (drug_name in return_dict):
				print("Warning! Duplicate!" + drug_name)
			else:
				return_dict[drug_name] = {}
				return_dict[drug_name]['background-color'] = '#%02x%02x%02x' % color
				return_dict[drug_name]['url'] = url
				return_dict[drug_name]['id'] = drug_name
				each_node['data']['url'] = url
				each_node['data']['background-color'] = return_dict[drug_name]['background-color']
	write_json(filename, origin_json)
	return return_dict




def append_url_color(data_dict, exemplar_file, new_file):
	try:
		exemplar_json = load_json(exemplar_file)
		for each_node in exemplar_json['elements']['nodes']:
			drug_name = each_node['data']['id_original']
			each_node['data']['id'] = drug_name
			del each_node['data']['id_original']
			if drug_name in data_dict:
				each_node['data']['url'] = data_dict[drug_name]['url']
				each_node['data']['background-color'] = data_dict[drug_name]['background-color']
			else:
				print('Warning: no corresponding name in dict',drug_name)
		for each_edge in exemplar_json['elements']['edges']:
			each_edge['data']['source'] = each_edge['data']['source_original']
			del each_edge['data']['source_original']
			each_edge['data']['target'] = each_edge['data']['target_original']
			del each_edge['data']['target_original']
			each_edge['data']['id'] = each_edge['data']['id_original']
			del each_edge['data']['id_original']
		write_json(exemplar_file,exemplar_json)

	except Exception as e:
		print(e)
		print("exemplar_file failed")

	try:
		new_json = load_json(new_file)
		for each_cluster in new_json['element']:
			for each_node in new_json['element'][each_cluster]['nodes']:
				drug_name = each_node['data']['id']
				if drug_name in data_dict:
					each_node['data']['url'] = data_dict[drug_name]['url']
					each_node['data']['background-color'] = data_dict[drug_name]['background-color']
				else:
					print('Warning: no corresponding name in dict', drug_name)
		write_json(new_file, new_json)
	except Exception as e:
		print(e)
		print("new_file failed")

nci60_dict = load_data('cluster.as.key.dnf.nci60.json')
append_url_color(nci60_dict, 'exemplar_nci60.json','new.noting.dnf.nci60.json')


ctrp_dict = load_data('cluster.as.key.dnf.ctrp.json')
append_url_color(ctrp_dict,'exemplar_ctrp.json',None)







# with open('out.txt', 'w') as outfile:
#     json.dump(json_data, outfile)



