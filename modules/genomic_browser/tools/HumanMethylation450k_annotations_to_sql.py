#!/usr/bin/python3
import csv
import re
import sys

# TODO Chack why there is only 485512 on 485577 annotation inserted 
# TODO Make this script work using the Illumina ftp available file
# TODO Benchmark for index creation after commit

def to_mysql_string(string):
    return "'" + string.replace("'","`") + "'" if 0 < len(string) else 'null'
annotation_file = sys.argv[1]

sys.stdout.write("SET @old_autocommit = @@autocommit, autocommit = 0;\n")
sys.stdout.write("START TRANSACTION;\n")
sys.stdout.write("INSERT IGNORE INTO genotyping_platform (Name, Description, TechnologyType, Provider) VALUES ( 'HumanMethylation450k', 'Infinium® HumanMethylation450 BeadChip','Bisulfite conversion', 'Illumina');\n")
platform_subquery = "(SELECT PlatformID FROM genotyping_platform WHERE Name = 'HumanMethylation450k')"

with open(annotation_file, 'r') as f:
    # Read line until the [Assay] section starts. (Skip headers)
    for line in f:
       if re.search('^\[Assay\]', line) :
          break;

    reader = csv.DictReader(f, delimiter=',')
    for line in reader:

        if 0 == len(line["Name"]) or 0 == len(line["CHR"]) or 0 == len(line["MAPINFO"]):
            continue;

        sys.stdout.write("INSERT IGNORE INTO genome_loc (Chromosome, EndLoc, StartLoc, Strand) VALUES\n")
        sys.stdout.write("  ('" + line["CHR"] + "'," + line["MAPINFO"] + "," + line["MAPINFO"] + ",'" + line["Strand"] + "');\n")
        genome_loc_subquery = "(SELECT GenomeLocID FROM genome_loc WHERE Chromosome = '" + line["CHR"] + "' AND StartLoc = " + line["MAPINFO"] + " AND EndLoc = " + line["MAPINFO"] + ")"

        sys.stdout.write("INSERT IGNORE INTO genomic_cpg_annotation (cpg_name, location_id, address_id_a, probe_seq_a, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id) VALUES\n")

        cpg_name            = to_mysql_string(line["Name"])
        location_id         = genome_loc_subquery
        address_id_a        = line["AddressA_ID"] if 0 < len(line["AddressA_ID"]) else 'null'
        probe_seq_a         = to_mysql_string(line["AlleleA_ProbeSeq"])
        address_id_b        = line["AddressB_ID"] if 0 < len(line["AddressB_ID"]) else 'null'
        probe_seq_b         = to_mysql_string(line["AlleleA_ProbeSeq"])
        design_type         = to_mysql_string(line["Infinium_Design_Type"])
        color_channel       = to_mysql_string(line["Color_Channel"])
        genome_build        = to_mysql_string(line["Genome_Build"])
        probe_snp_10        = to_mysql_string(line["Probe_SNPs_10"])
        gene_name           = to_mysql_string(line["UCSC_RefGene_Name"])
        gene_acc_num        = to_mysql_string(line["UCSC_RefGene_Accession"])
        gene_group          = to_mysql_string(line["UCSC_RefGene_Group"])
        island_loc          = to_mysql_string(line["UCSC_CpG_Islands_Name"])
        island_relation     = to_mysql_string(line["Relation_to_UCSC_CpG_Island"])
        fantom_promoter_loc = to_mysql_string(line["Phantom"])
        dmr                 = to_mysql_string(line["DMR"])
        enhancer            = line["Enhancer"] if 0 < len(line["Enhancer"]) else 'null'
        hmm_island_loc      = to_mysql_string(line["HMM_Island"])
        reg_feature_loc     = to_mysql_string(line["Regulatory_Feature_Name"])
        reg_feature_group   = to_mysql_string(line["Regulatory_Feature_Group"])
        dhs                 = line["DHS"] if 0 < len(line["DHS"]) else 'null'
        platform_id         = platform_subquery
        
        sys.stdout.write("(" + ','.join([cpg_name, location_id, address_id_a, probe_seq_a, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id]) + ");\n")

sys.stdout.write("COMMIT;\n")
sys.stdout.write("SET autocommit = @old_autocommit;\n")
f.closed

