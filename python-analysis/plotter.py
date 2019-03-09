import os
import matplotlib.pyplot as plt
import numpy as np
import sys

rootfolder = sys.argv[1]
for rootdir, dirs, filenames in os.walk(rootfolder):
    for filename in filenames:
        if ".csv" in filename and "Radgeschw" in filename:
            data = np.genfromtxt(os.path.join(rootfolder, filename), delimiter=',')
            data = np.transpose(data)
            plt.plot(data[0], data[1], label=filename.replace(".csv", ""))
    plt.legend()
    plt.savefig(os.path.join(rootfolder, "radgeschw.png"))
    plt.clf()
    for filename in filenames:
        if ".csv" in filename and "beschl" in filename:
            data = np.genfromtxt(os.path.join(rootfolder, filename), delimiter=',')
            data = np.transpose(data)
            plt.plot(data[0], data[1], label=filename.replace(".csv", ""))
    plt.legend()
    plt.savefig(os.path.join(rootfolder, "beschl.png"))