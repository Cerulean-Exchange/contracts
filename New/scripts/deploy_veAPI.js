async function main(){

    try {
        //Deploy veapi
        veApi = await ethers.getContractFactory("Viri_VE_Api")
                                          //address _oracle, address _pool2, address _viri, address _voter, address _ve
        veApiContract = await veApi.deploy("0xDea7a52204461e5d7324E9300f3cAaA81cEc034F","0xb6A4891DBf867131AA61B10F48F3F595700A38a1","0x2D743F95f99e19366C2e52d00fE4718b14202e36","0xae7192C5c94a47B5747Cc8e462859462E49AebA7","0x7E4c0246B5b449a3a2eb04Bae68a29d6E2A36f52");
        console.log(veApiContract)
        fs.appendFileSync(path.join(__dirname, 'testnetContracts.txt'), `veApiContract: ${veApiContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar veApiContract", error);
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });