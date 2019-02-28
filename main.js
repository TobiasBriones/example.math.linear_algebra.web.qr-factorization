
const clear = () => {
    const msg = document.getElementsByClassName("message")[0];
    const qmatrix = document.getElementById("qmatrix");
    const rmatrix = document.getElementById("rmatrix");
    
    msg.innerHTML = "";
    qmatrix.innerHTML = "";
    rmatrix.innerHTML = "";
    
}

const updateStyle = rows => {
    const style = document.createElement("style");
    const width = `${100 / rows - 3}%`;
    
    style.innerHTML = `.matrix > div > div {
        width: ${width};
    }`;
    document.head.appendChild(style);
    
}

const setRow = (rowEl, value) => {
    const itemEl = document.createElement("div");
    
    itemEl.innerHTML = value;
    rowEl.appendChild(itemEl);
    
}

const addRow = matrix => {
    const row = document.createElement("div");
    
    matrix.appendChild(row);
    return row;
    
}

const updateMatrix = (n, str, factorizator) => {
    const items = str.split(",");
    const rows = [];
    const input = document.getElementsByClassName("matrix")[0];
    var i = 0;
    var j = 0;
    
    if(items.length != n * n) {
        alert(`${items.length} elementos dados, ${n*n} requeridos`);
        return;
        
    }
    input.innerHTML = "";
    var row = addRow(input);
    
    updateStyle(n);
    items.forEach(element => {
        if(isNaN(element)) {
            alert(`El elemento ${element} no es un número`);
            return false;
            
        }
        if(!rows[j]) {
            rows[j] = [];
            
        }
        rows[j].push(element);
        setRow(row, element);
        i++;
        
        if(i == n) {
            i = 0;
            j++;
            
            if(j < n) {
                row = addRow(input);
                
            }
            
        }
        
    });
    factorizator.matrix = math.matrix(rows);
    
}

class QRFactorization {
    
    
    constructor(msgEl) {
        this.matrix = math.matrix([[1,2,3], [4,5,6], [7,8,90]]);
        this.msgEl = msgEl;
        
    }
    
    update(qmatrixData, rmatrixData, n) {
        const qmatrix = document.getElementById("qmatrix");
        const rmatrix = document.getElementById("rmatrix");
        const fillMatrix = (matrix, data) => {
            var row = addRow(matrix);
            var j = 0;
            var i = 0;
            
            data.forEach(element => {
                if(element.toString().length > 5 && (Math.floor(element) != element)) {
                    element = Math.floor(element * 1000) / 1000;
                    
                }
                const item = document.createElement("div");
                
                item.innerHTML = element;
                row.appendChild(item);
                i++;
                
                if(i == n) {
                    i = 0;
                    j++;
                    
                    if(j < n) {
                        row = addRow(matrix);
                        
                    }
                    
                }
                
            });
            
        }
        fillMatrix(qmatrix, qmatrixData);
        fillMatrix(rmatrix, rmatrixData);
        
    }
    
    normalize(vector) {
        const norm = () => {
            var factor = 0;
            
            vector.forEach(value => factor += Math.pow(value, 2));
            return Math.sqrt(factor);
            
        }
        return math.divide(vector, norm());
        
    }
    
    proj(v, u) {
        const vu = math.multiply(v, u);
        const uu = math.multiply(u, u);
        return math.dotMultiply(u, vu / uu);
        
    }
    
    calcOrtogonal(vectors, ortogonals, k) {
        const currentU = vectors[k];
        var result = vectors[k];
        
        for(let j = 0; j < k; j++) {
            const current = ortogonals[j];
            const term = this.proj(currentU, current);
            result = math.subtract(result, term);
            
        }
        return result;
        
    }
    
    getQMatrix() {
        const transposed = math.transpose(this.matrix);
        const vectors = transposed._data;
        const orthogonalVectors = [];
        const result = [];
        var currentU = vectors[0];
        
        orthogonalVectors.push(currentU);
        result.push(this.normalize(currentU));
        for(let i = 1; i < vectors.length; i++) {
            currentU = this.calcOrtogonal(vectors, orthogonalVectors, i);
            
            orthogonalVectors.push(currentU);
            result.push(this.normalize(currentU));
            
        }
        const qMatrix = math.transpose(math.matrix(result));
        return qMatrix;
        
    }
    
    getRMatrix(qMatrix) {
        const transposed = math.transpose(this.matrix);
        const vectors = transposed._data;
        const orthonormalVectors = math.transpose(qMatrix)._data;
        const rows = [];
        const n = this.matrix._data.length;
        
        for(let i = 0; i < n; i++) {
            const qRow = orthonormalVectors[i];
            rows[i] = [];
            
            for(let j = 0; j < n; j++) {
                if(j < i) {
                    rows[i].push(0);
                    
                }
                else {
                    rows[i].push(math.multiply(qRow, vectors[j]));
                    
                }
                
            }
            
        }
        return math.matrix(rows);
        
    }
    
    compute() {
        // Check each column is LI iff det* != 0
        const det = math.det(this.matrix);
        
        clear();
        if(det == 0) {
            this.msgEl.innerHTML = `Las columnas no son linealmente independientes
                                    (determinante ${det})`;
            return;
            
        }
        const n = this.matrix._data.length;
        const qMatrix = this.getQMatrix();
        const rMatrix = this.getRMatrix(qMatrix);
        
        this.update(qMatrix, rMatrix, n);
        console.log(math.multiply(qMatrix,rMatrix))
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    const msg = document.getElementsByClassName("message")[0];
    const factorizator = new QRFactorization(msg);
    
    document.getElementById("update").addEventListener("click", () => {
       const rows = document.getElementById("rows").value;
       const str = document.getElementById("values").value;
       
       updateMatrix(rows, str, factorizator);
       factorizator.compute();
       
    });
    document.getElementById("update").click()
});
