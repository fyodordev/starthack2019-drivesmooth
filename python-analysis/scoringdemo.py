import sys
import os
import numpy as np

rootfolder = sys.argv[1]
for rootdir, dirs, filenames in os.walk(rootfolder):
    horizontal = np.genfromtxt(os.path.join(rootfolder, "ESP_Querbeschleunigung.csv"), delimiter=',')
    horizontal = np.transpose(horizontal)
    hortime = horizontal[0]
    vertical = np.genfromtxt(os.path.join(rootfolder, "ESP_Laengsbeschl.csv"), delimiter=',')
    vertical = np.transpose(vertical)
    vertime = vertical[0]

    times, indices_hor, indices_ver = np.intersect1d(hortime, vertime, assume_unique=True, return_indices=True)
    horizontal = np.take(horizontal[1], indices_hor)
    vertical = np.take(vertical[1], indices_ver)
    times = np.subtract(times, times[0])
    times = np.divide(times, 60*1e9)
    horizontal = np.multiply(horizontal, 7)
