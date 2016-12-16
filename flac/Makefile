OUTPUT=MOD

all:noise

noise:
	mkdir -p $(OUTPUT) ; 
	for  i in `ls -d *.flac` ; do file=`basename $$i .flac ` ;\
	sox $$file.flac  -n trim 0.005 0.01 noiseprof profile ;\
	sox $$file.flac $(OUTPUT)/$$file.flac noisered profile ;\
	done;

decode:
	for  i in `ls -d *.flac` ; do file=`basename $$i .flac `;\
	flac -d $$file.flac ;
	done ;
  