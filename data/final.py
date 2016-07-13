import json

def parse(file, drug_num):
    rdata = open('./dnf.' + file + '.txt', 'r')
    drug_list = rdata.readline().strip().strip("\n").split("\t")
    similar_list = []

    for drug in drug_list:
        simi = rdata.readline().split("\t")
        similar_list.append(map(float, simi))

    cluster_list = open("./" + file + ".txt")

    result = {"element": {}}
    edge_id = 0

    for i in range(drug_num):
        cluster = {}
        # cluster['nodes'] = []
        # cluster['edges'] = []
        nodes = []
        edges = []

        node_id = map(int, cluster_list.readline().split())
        # print node_id

        for j in range(len(node_id)):
            nodes.append({"data": {"id": drug_list[node_id[j]-1].strip('\"')}})

            for n in range(j+1, len(node_id)):
                source = drug_list[node_id[j]-1]
                target = drug_list[node_id[n]-1]
                weight = 1/(similar_list[node_id[j]-1][node_id[n]-1])
                id = "e"+str(edge_id)
                edge_id += 1
                edges.append({"data": {"source": source.strip('\"'), "id": id, "weight":weight, "target":target.strip('\"')}})

        result["element"][str(i)] = {"nodes":nodes, "edges":edges}


    with open('./final.dnf.' + file + '.json', 'w') as outfile:
        json.dump(result, outfile, indent=4)


parse("ctrp", 53)
parse("nci60", 51)
