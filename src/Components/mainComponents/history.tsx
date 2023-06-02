function History (){
    /*useEffect(() => {
        const transHistory = async () => {
          if (uid) {
            const docRef = doc(db, 'users', uid, transactions);
            const docSnap = await getDoc(docRef);
          
            if (docSnap.exists()) {
              const data = docSnap.data();
            }
          }
        };
        
        transHistory();
      }, [uid]);*/
    return(
        <div>
            <h1>History</h1>
        </div>
    )
}

export default History